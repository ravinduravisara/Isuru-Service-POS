import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app } from '../src/app.js';
import { connectDB, disconnectDB, prisma } from '../src/config/database.js';

let adminToken = '';
let staffToken = '';
const testSuffix = Date.now();

beforeAll(async () => {
  await connectDB();

  // Provision test users
  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'test_sec_admin' },
    update: { passwordHash: adminHash, role: 'Admin' },
    create: { username: 'test_sec_admin', passwordHash: adminHash, role: 'Admin', fullName: 'Security Admin' },
  });

  const staffHash = await bcrypt.hash('staff123', 10);
  await prisma.user.upsert({
    where: { username: 'test_sec_staff' },
    update: { passwordHash: staffHash, role: 'User' },
    create: { username: 'test_sec_staff', passwordHash: staffHash, role: 'User', fullName: 'Security Staff' },
  });

  const adminRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ username: 'test_sec_admin', password: 'admin123' });
  adminToken = adminRes.body.token;

  const staffRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ username: 'test_sec_staff', password: 'staff123' });
  staffToken = staffRes.body.token;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Security Hardening & Credential Protection', () => {
  it('Should reject login if credentials only exist as plaintext in settings table', async () => {
    // Inject a dummy setting with plaintext password
    await prisma.setting.upsert({
      where: { key: 'fake_username' },
      update: { value: 'fake_user' },
      create: { key: 'fake_username', value: 'fake_user' },
    });
    await prisma.setting.upsert({
      where: { key: 'fake_password' },
      update: { value: 'fake_pass_123' },
      create: { key: 'fake_password', value: 'fake_pass_123' },
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'fake_user', password: 'fake_pass_123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);

    // Clean up
    await prisma.setting.deleteMany({ where: { key: { in: ['fake_username', 'fake_password'] } } });
  });

  it('POST /api/v1/auth/setup should reject setup if users already exist', async () => {
    const res = await request(app)
      .post('/api/v1/auth/setup')
      .send({
        username: 'unauthorized_new_admin',
        password: 'Password123!',
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Initial setup is locked');
  });

  it('PUT /api/v1/settings/credentials should securely hash passwords and scrub plaintext from settings', async () => {
    const newAdminPass = 'NewAdminPass2026!';
    const newStaffPass = 'NewStaffPass2026!';

    const res = await request(app)
      .put('/api/v1/settings/credentials')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        adminUsername: 'test_sec_admin',
        adminPassword: newAdminPass,
        userUsername: 'test_sec_staff',
        userPassword: newStaffPass,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify plaintext passwords do NOT exist in settings table
    const plaintextInSettings = await prisma.setting.findMany({
      where: {
        key: { in: ['admin_password', 'user_password'] },
      },
    });
    expect(plaintextInSettings.length).toBe(0);

    // Verify user can log in with new password
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'test_sec_admin', password: newAdminPass });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});

describe('Atomic Inventory Transactions & Concurrency Controls', () => {
  const testItemId = `OIL-RACE-${testSuffix}`;

  beforeAll(async () => {
    // Create product with exactly 5 units in stock
    await prisma.product.create({
      data: {
        itemId: testItemId,
        itemName: 'Racing Synthetic Oil',
        brand: 'Mobil1',
        quantity: 5,
        unitPrice: 5000.0,
        buyingPrice: 3500.0,
      },
    });
  });

  it('Should reject sale and prevent overselling when requested quantity exceeds available stock', async () => {
    const res = await request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        customerName: 'Shortage Test Customer',
        customerPhone: '0779998877',
        vehicleNo: 'CAB-9999',
        vehicleType: 'Car',
        paymentMethod: 'Cash',
        paymentStatus: 'Paid',
        discount: 0,
        items: [
          {
            service: 'Oil Change',
            itemId: testItemId,
            description: 'Attempting to buy 10 when only 5 exist',
            qty: 10, // Exceeds available stock of 5
            rate: 5000,
          },
        ],
      });

    expect(res.status).toBe(500);
    expect(res.body.error).toContain('Insufficient stock');

    // Verify stock remains untouched at 5
    const product = await prisma.product.findUnique({ where: { itemId: testItemId } });
    expect(product?.quantity).toBe(5);
  });

  it('Should safely handle concurrent sales: only one transaction succeeds when competing for remaining stock', async () => {
    // Both request 4 units simultaneously. Since available stock is 5, only 1 request can succeed!
    const req1 = request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        customerName: 'Concurrent Buyer 1',
        customerPhone: '0771112233',
        vehicleNo: 'WP-AA-1111',
        vehicleType: 'Car',
        paymentMethod: 'Cash',
        items: [{ service: 'Oil Filter', itemId: testItemId, qty: 4, rate: 5000 }],
      });

    const req2 = request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        customerName: 'Concurrent Buyer 2',
        customerPhone: '0774445566',
        vehicleNo: 'WP-BB-2222',
        vehicleType: 'Car',
        paymentMethod: 'Cash',
        items: [{ service: 'Oil Filter', itemId: testItemId, qty: 4, rate: 5000 }],
      });

    const [res1, res2] = await Promise.all([req1, req2]);

    const successes = [res1, res2].filter((r) => r.status === 201);
    const failures = [res1, res2].filter((r) => r.status >= 400);

    // Exactly 1 must succeed and 1 must fail due to insufficient stock
    expect(successes.length).toBe(1);
    expect(failures.length).toBe(1);
    expect(failures[0].body.error).toMatch(/Insufficient stock|conflict/i);

    // Exactly 5 - 4 = 1 unit must remain in inventory (never negative or corrupted)
    const product = await prisma.product.findUnique({ where: { itemId: testItemId } });
    expect(product?.quantity).toBe(1);
  });

  it('Should roll back entire transaction if one item in a multi-item invoice fails stock check', async () => {
    const secondItemId = `PLUG-ROLLBACK-${testSuffix}`;
    await prisma.product.create({
      data: {
        itemId: secondItemId,
        itemName: 'Spark Plug',
        quantity: 10,
        unitPrice: 1200.0,
        buyingPrice: 800.0,
      },
    });

    const billNoBefore = await prisma.invoice.count();

    const res = await request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        customerName: 'Rollback Test Customer',
        customerPhone: '0770001122',
        vehicleNo: 'CP-CC-3333',
        items: [
          // Item 1 has sufficient stock (10 available, requests 2)
          { service: 'Part', itemId: secondItemId, qty: 2, rate: 1200 },
          // Item 2 has INSUFFICIENT stock (only 1 available, requests 3)
          { service: 'Oil', itemId: testItemId, qty: 3, rate: 5000 },
        ],
      });

    expect(res.status).toBe(500);
    expect(res.body.error).toContain('Insufficient stock');

    // Verify complete rollback: Item 1 stock MUST NOT be decremented!
    const product2 = await prisma.product.findUnique({ where: { itemId: secondItemId } });
    expect(product2?.quantity).toBe(10); // Untouched!

    // Verify no orphaned invoice was created
    const billNoAfter = await prisma.invoice.count();
    expect(billNoAfter).toBe(billNoBefore);
  });
});
