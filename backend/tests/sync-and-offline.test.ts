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
});
