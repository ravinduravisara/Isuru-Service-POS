import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { app } from '../src/app.js';
import { connectDB, disconnectDB, prisma } from '../src/config/database.js';

let authToken = '';
const timestamp = Date.now();
const testItemCode = `SYNC-TEST-${timestamp}`;

beforeAll(async () => {
  await connectDB();

  // Ensure test admin exists
  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'sync_test_admin' },
    update: { passwordHash: adminHash, role: 'Admin' },
    create: { username: 'sync_test_admin', passwordHash: adminHash, role: 'Admin', fullName: 'Sync Test Admin' },
  });

  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ username: 'sync_test_admin', password: 'admin123' });
  authToken = loginRes.body.token;

  // Create test product for inventory deduction verification
  await prisma.product.create({
    data: {
      itemId: testItemCode,
      itemName: 'Sync Test Oil Filter',
      brand: 'Sakura',
      quantity: 50,
      unitPrice: 1500,
      buyingPrice: 1000,
      paymentMethod: 'Cash',
    },
  });
});

afterAll(async () => {
  // Clean up test data
  try {
    await prisma.invoiceItem.deleteMany({
      where: { itemId: testItemCode },
    });
    await prisma.product.deleteMany({
      where: { itemId: testItemCode },
    });
  } catch {
    // Ignore cleanup errors
  }
  await disconnectDB();
});

describe('Phase E: Synchronization Engine & Idempotent API', () => {
  it('Should return sync operational metrics from /api/v1/sync/status', async () => {
    const res = await request(app)
      .get('/api/v1/sync/status')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('totalSynced');
    expect(typeof res.body.totalSynced).toBe('number');
  });

  it('Should successfully synchronize a provisional invoice and deduct inventory atomically', async () => {
    const clientTxId = crypto.randomUUID();
    const provisionalBillNo = `OFF-20261108-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      clientTxId,
      provisionalBillNo,
      customerName: 'Sync Offline Customer',
      customerPhone: '0771234567',
      vehicleNo: 'CAB-9999',
      vehicleType: 'Car',
      dateTime: new Date().toISOString(),
      subtotalAmount: 3000,
      discountAmount: 200,
      totalAmount: 2800,
      paymentMethod: 'Cash',
      paymentStatus: 'Paid',
      items: [
        {
          service: 'Sync Test Oil Filter',
          itemId: testItemCode,
          description: 'High performance filter',
          qty: 2,
          rate: 1500,
          amount: 3000,
        },
      ],
    };

    const res = await request(app)
      .post('/api/v1/sync/invoices')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.invoice).toBeDefined();
    expect(res.body.invoice.clientTxId).toBe(clientTxId);
    expect(res.body.invoice.billNo).toMatch(/^INV-/);

    // Verify inventory deduction: was 50, sold 2 -> should now be 48
    const updatedProd = await prisma.product.findUnique({
      where: { itemId: testItemCode },
    });
    expect(updatedProd?.quantity).toBe(48);

    // Verify SyncOperation record
    const syncOp = await prisma.syncOperation.findUnique({
      where: { clientOpId: clientTxId },
    });
    expect(syncOp).toBeDefined();
    expect(syncOp?.status).toBe('APPLIED');
  });

  it('IDEMPOTENCY: Should return existing invoice without deducting stock twice if clientTxId is resent', async () => {
    const clientTxId = crypto.randomUUID();
    const provisionalBillNo = `OFF-20261108-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      clientTxId,
      provisionalBillNo,
      customerName: 'Idempotency Customer',
      customerPhone: '0779998877',
      vehicleNo: 'WP-1234',
      vehicleType: 'Car',
      dateTime: new Date().toISOString(),
      subtotalAmount: 1500,
      discountAmount: 0,
      totalAmount: 1500,
      paymentMethod: 'Cash',
      paymentStatus: 'Paid',
      items: [
        {
          service: 'Sync Test Oil Filter',
          itemId: testItemCode,
          description: 'Single item sale',
          qty: 3,
          rate: 1500,
          amount: 1500,
        },
      ],
    };

    // First submission (returns 201 Created)
    const res1 = await request(app)
      .post('/api/v1/sync/invoices')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    expect(res1.status).toBe(201);
    const invoiceId1 = res1.body.invoice.id;
    const billNo1 = res1.body.invoice.billNo;

    // Check inventory after first submission: was 48, sold 3 -> should be 45
    const prodAfterFirst = await prisma.product.findUnique({
      where: { itemId: testItemCode },
    });
    expect(prodAfterFirst?.quantity).toBe(45);

    // Second submission (returns 200 OK with duplicate indicator)
    const res2 = await request(app)
      .post('/api/v1/sync/invoices')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    expect(res2.status).toBe(200);
    expect(res2.body.success).toBe(true);
    expect(res2.body.message).toContain('already synchronized');
    expect(res2.body.invoice.id).toBe(invoiceId1);
    expect(res2.body.invoice.billNo).toBe(billNo1);

    // Stock must remain 45 (ZERO duplicate deduction)
    const prodAfterSecond = await prisma.product.findUnique({
      where: { itemId: testItemCode },
    });
    expect(prodAfterSecond?.quantity).toBe(45);
  });

  it('Should handle dual-code slash part numbers during sync stock deduction', async () => {
    const uniquePrefix = `C-DUAL-${timestamp}`;
    const dualCode = `${uniquePrefix} / JX-DUAL-${timestamp}`;
    await prisma.product.create({
      data: {
        itemId: dualCode,
        itemName: 'Dual Code Part',
        quantity: 20,
        unitPrice: 2000,
        buyingPrice: 1200,
        paymentMethod: 'Cash',
      },
    });

    const clientTxId = crypto.randomUUID();
    const res = await request(app)
      .post('/api/v1/sync/invoices')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        clientTxId,
        customerName: 'Slash Part Customer',
        vehicleNo: 'VEH-SLASH',
        items: [
          {
            service: 'Dual Code Part',
            itemId: uniquePrefix, // Sold by primary prefix
            qty: 5,
            rate: 2000,
            amount: 10000,
          },
        ],
        subtotalAmount: 10000,
        discountAmount: 0,
        totalAmount: 10000,
        paymentMethod: 'Cash',
      });

    expect(res.status).toBe(201);

    const updated = await prisma.product.findUnique({
      where: { itemId: dualCode },
    });
    expect(updated?.quantity).toBe(15);

    // Clean up
    await prisma.invoiceItem.deleteMany({ where: { itemId: uniquePrefix } });
    await prisma.product.deleteMany({ where: { itemId: dualCode } });
  });

  it('Should reject sync invoice requests missing clientTxId or customer name with 400', async () => {
    const resNoTx = await request(app)
      .post('/api/v1/sync/invoices')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        customerName: 'No Tx Customer',
        vehicleNo: 'NO-TX',
        items: [],
      });
    expect(resNoTx.status).toBe(400);
    expect(resNoTx.body.error).toContain('clientTxId is required');

    const resNoCust = await request(app)
      .post('/api/v1/sync/invoices')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        clientTxId: crypto.randomUUID(),
        customerName: '',
        vehicleNo: 'NO-CUST',
        items: [],
      });
    expect(resNoCust.status).toBe(400);
    expect(resNoCust.body.error).toContain('Customer name and vehicle number are required');
  });

  it('Should gracefully log conflict warnings without failing invoice when offline sold quantity exceeds stock', async () => {
    const conflictItemCode = `CONFLICT-ITEM-${timestamp}`;
    await prisma.product.create({
      data: {
        itemId: conflictItemCode,
        itemName: 'Low Stock Item',
        quantity: 1, // Only 1 available in cloud
        unitPrice: 500,
        buyingPrice: 300,
        paymentMethod: 'Cash',
      },
    });

    const clientTxId = crypto.randomUUID();
    const res = await request(app)
      .post('/api/v1/sync/invoices')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        clientTxId,
        customerName: 'Conflict Buyer',
        vehicleNo: 'CAB-CONFLICT',
        items: [
          {
            service: 'Low Stock Item',
            itemId: conflictItemCode,
            qty: 5, // Sold 5 while offline
            rate: 500,
            amount: 2500,
          },
        ],
        subtotalAmount: 2500,
        discountAmount: 0,
        totalAmount: 2500,
        paymentMethod: 'Cash',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.conflicts.length).toBeGreaterThan(0);
    expect(res.body.conflicts[0]).toContain('offline sold 5, but current stock was 1');

    // Clean up
    await prisma.invoiceItem.deleteMany({ where: { itemId: conflictItemCode } });
    await prisma.product.deleteMany({ where: { itemId: conflictItemCode } });
  });

  it('LOCAL-FIRST: Creating an invoice locally creates an atomic SyncOutbox record', async () => {
    const res = await request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        customerName: 'Local Outbox Customer',
        customerPhone: '0711122334',
        vehicleNo: 'WP-LOC-1234',
        vehicleType: 'Car',
        items: [
          {
            service: 'Local Oil Change',
            itemId: testItemCode,
            description: 'Local test filter',
            qty: 1,
            rate: 1500,
            amount: 1500,
          },
        ],
        discount: 0,
        paymentMethod: 'Cash',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    const invoiceId = res.body.invoice.id;

    // Verify outbox entry exists in PostgreSQL
    const outboxOp = await prisma.syncOutbox.findFirst({
      where: {
        entityType: 'INVOICE',
        entityId: invoiceId,
      },
    });

    expect(outboxOp).toBeDefined();
    expect(outboxOp?.status).toBe('PENDING');
    expect(outboxOp?.operationType).toBe('CREATE');
    const payload = JSON.parse(outboxOp!.payload);
    expect(payload.customerName).toBe('Local Outbox Customer');

    // Clean up
    await prisma.syncOutbox.deleteMany({ where: { id: outboxOp!.id } });
    await prisma.invoiceItem.deleteMany({ where: { invoiceId } });
    await prisma.invoice.deleteMany({ where: { id: invoiceId } });
  });

  it('BATCH PUSH: POST /api/v1/sync/push accepts batch outbox operations and commits idempotently', async () => {
    const pushOpId = crypto.randomUUID();
    const pushBillNo = `INV-PUSH-${Date.now().toString().slice(-6)}`;

    const batchPayload = {
      deviceId: 'test-terminal-01',
      operations: [
        {
          operationId: pushOpId,
          entityType: 'INVOICE',
          entityId: crypto.randomUUID(),
          operationType: 'CREATE',
          idempotencyKey: `idemp-${pushOpId}`,
          payload: {
            billNo: pushBillNo,
            customerName: 'Batch Push Customer',
            customerPhone: '0779988776',
            vehicleNo: 'CAB-PUSH',
            vehicleType: 'Van',
            dateTime: new Date().toISOString(),
            subtotalAmount: 1500,
            discountAmount: 0,
            totalAmount: 1500,
            paymentMethod: 'Cash',
            paymentStatus: 'Paid',
            items: [
              {
                service: 'Batch Push Filter',
                itemId: testItemCode,
                qty: 1,
                rate: 1500,
                amount: 1500,
              },
            ],
          },
        },
      ],
    };

    // First push: Should succeed with 200 and SYNCED
    const res1 = await request(app)
      .post('/api/v1/sync/push')
      .send(batchPayload);

    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);
    expect(res1.body.results[0].status).toBe('SYNCED');

    // Second push with same payload: IDEMPOTENCY check
    const res2 = await request(app)
      .post('/api/v1/sync/push')
      .send(batchPayload);

    expect(res2.status).toBe(200);
    expect(res2.body.results[0].status).toBe('SYNCED');
    expect(res2.body.results[0].serverAcknowledgement).toContain('Already Processed');

    // Clean up
    await prisma.invoiceItem.deleteMany({ where: { itemId: testItemCode } });
    await prisma.invoice.deleteMany({ where: { billNo: pushBillNo } });
    await prisma.syncOperation.deleteMany({ where: { clientOpId: `idemp-${pushOpId}` } });
  });

  it('TWO-WAY PULL: GET /api/v1/sync/pull returns updated products and services', async () => {
    const res = await request(app)
      .get('/api/v1/sync/pull');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(Array.isArray(res.body.services)).toBe(true);
    expect(res.body.serverTime).toBeDefined();
  });
});
