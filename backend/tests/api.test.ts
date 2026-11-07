import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app } from '../src/app.js';
import { connectDB, disconnectDB, prisma } from '../src/config/database.js';

let adminToken = '';
let staffToken = '';
const timestamp = Date.now();

beforeAll(async () => {
  await connectDB();

  // Ensure accounts exist in the database with salted hashes
  const adminHash = await bcrypt.hash('Isuru@service', 10);
  await prisma.user.upsert({
    where: { username: 'Isuru@6800' },
    update: { passwordHash: adminHash, role: 'Admin' },
    create: { username: 'Isuru@6800', passwordHash: adminHash, role: 'Admin', fullName: 'Administrator' },
  });

  const staffHash = await bcrypt.hash('User@service', 10);
  await prisma.user.upsert({
    where: { username: 'User@123' },
    update: { passwordHash: staffHash, role: 'User' },
    create: { username: 'User@123', passwordHash: staffHash, role: 'User', fullName: 'Service Staff' },
  });

  // Obtain admin token
  const adminRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ username: 'Isuru@6800', password: 'Isuru@service' });
  adminToken = adminRes.body.token;

  // Obtain staff token
  const staffRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ username: 'User@123', password: 'User@service' });
  staffToken = staffRes.body.token;
});

afterAll(async () => {
  await disconnectDB();
});

describe('1. Health and Authentication API', () => {
  it('GET /api/v1/health should return ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('ISURU');
  });

  it('POST /api/v1/auth/login should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'WrongUser', password: 'WrongPassword' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/auth/me should return current authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('Admin');
  });

  it('POST /api/v1/auth/logout should succeed and clear token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('2. Role-Based Permissions & Guarding', () => {
  it('Staff user cannot create services (Admin only)', async () => {
    const res = await request(app)
      .post('/api/v1/services')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ category: 'Car', name: 'Unauthorized Service', price: 100 });
    expect(res.status).toBe(403);
  });

  it('Staff user cannot access Profit Statement (Admin only)', async () => {
    const res = await request(app)
      .get('/api/v1/profit-statement')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(403);
  });

  it('Staff user cannot delete inventory products (Admin only)', async () => {
    const res = await request(app)
      .delete('/api/v1/inventory/someid')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(403);
  });

  it('Staff user cannot access data purge (Admin only)', async () => {
    const res = await request(app)
      .post('/api/v1/settings/purge')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ type: 'suppliers' });
    expect(res.status).toBe(403);
  });
});

describe('3. Customers & Vehicles CRUD & Autocomplete', () => {
  let createdCustId = '';

  it('POST /api/v1/customers should register customer (Staff/Cashier allowed)', async () => {
    const res = await request(app)
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ name: `Audit Customer ${timestamp}`, phone: '0771234567' });
    expect(res.status).toBe(201);
    expect(res.body.customer.name).toContain('Audit Customer');
    createdCustId = res.body.customer.id;
  });

  it('GET /api/v1/customers should list customers with search filter', async () => {
    const res = await request(app)
      .get(`/api/v1/customers?search=${timestamp}`)
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.customers.length).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/v1/vehicles should register vehicle linked to customer', async () => {
    const res = await request(app)
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        customerId: createdCustId,
        vehicleNo: `WP-CAB-${timestamp.toString().slice(-4)}`,
        vehicleType: 'Car',
      });
    expect(res.status).toBe(201);
    expect(res.body.vehicle.vehicleNo).toContain('WP-CAB-');
  });

  it('GET /api/v1/customers/search should autocomplete customer by query', async () => {
    const res = await request(app)
      .get(`/api/v1/customers/search?q=${timestamp}`)
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.customers.length).toBeGreaterThanOrEqual(1);
    expect(res.body.customers[0].vehicles.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/customers/:id should return customer drilldown with vehicles and invoices', async () => {
    const res = await request(app)
      .get(`/api/v1/customers/${createdCustId}`)
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.customer.id).toBe(createdCustId);
    expect(res.body.vehicles.length).toBeGreaterThanOrEqual(1);
  });

  it('PUT /api/v1/customers/:id should update customer details', async () => {
    const res = await request(app)
      .put(`/api/v1/customers/${createdCustId}`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ name: `Audit Customer Updated ${timestamp}`, phone: '0779999999' });
    expect(res.status).toBe(200);
    expect(res.body.customer.name).toContain('Updated');
    expect(res.body.customer.phone).toBe('0779999999');
  });

  it('DELETE /api/v1/customers/:id should delete customer (Admin only)', async () => {
    const res = await request(app)
      .delete(`/api/v1/customers/${createdCustId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check = await prisma.customer.findUnique({ where: { id: createdCustId } });
    expect(check).toBeNull();
  });
});

describe('4. Services Management & Vehicle Filtering CRUD', () => {
  let createdServiceId = '';

  it('GET /api/v1/services?category=Car should return car services and others', async () => {
    const res = await request(app)
      .get('/api/v1/services?category=Car')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.services.length).toBeGreaterThan(0);
    res.body.services.forEach((s: any) => {
      expect(['Car', 'Others']).toContain(s.category);
    });
  });

  it('POST /api/v1/services should create a new labor service (Admin)', async () => {
    const res = await request(app)
      .post('/api/v1/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        category: 'Van',
        name: `Brake Pad Service ${timestamp}`,
        price: 3200,
        description: 'Complete brake inspection & replacement',
      });
    expect(res.status).toBe(201);
    expect(res.body.service.name).toBe(`Brake Pad Service ${timestamp}`);
    expect(res.body.service.price).toBe(3200);
    createdServiceId = res.body.service.id;
  });

  it('PUT /api/v1/services/:id should update service rate and details (Admin)', async () => {
    const res = await request(app)
      .put(`/api/v1/services/${createdServiceId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        category: 'Van',
        name: `Brake Pad Service Updated ${timestamp}`,
        price: 3600,
        description: 'Upgraded brake overhaul',
      });
    expect(res.status).toBe(200);
    expect(res.body.service.price).toBe(3600);
  });

  it('DELETE /api/v1/services/:id should delete service (Admin)', async () => {
    const res = await request(app)
      .delete(`/api/v1/services/${createdServiceId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('5. Inventory & Stock Management CRUD', () => {
  let autoItemId = '';
  let createdProdId = '';

  it('POST /api/v1/inventory should add product with auto ID generation', async () => {
    const res = await request(app)
      .post('/api/v1/inventory')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        itemName: 'Engine Oil',
        brand: `Mobil 1 5W-30 ${timestamp}`,
        quantity: 20,
        unitPrice: 12500,
        buyingPrice: 9000,
        supplierCode: 'SUP-0001',
        paymentMethod: 'Cash',
      });
    expect([200, 201]).toContain(res.status);
    autoItemId = res.body.product.itemId;
    createdProdId = res.body.product._id || res.body.product.id;
    expect(autoItemId).toMatch(/^ENG-\d{4}$/);
  });

  it('GET /api/v1/inventory/lookup/:itemId should return product by URL param', async () => {
    const res = await request(app)
      .get(`/api/v1/inventory/lookup/${autoItemId}`)
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.found).toBe(true);
    expect(res.body.product.unitPrice).toBe(12500);
  });

  it('GET /api/v1/inventory/lookup?itemId=... should return product by query string', async () => {
    const res = await request(app)
      .get(`/api/v1/inventory/lookup?itemId=${autoItemId}`)
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.found).toBe(true);
    expect(res.body.product.unitPrice).toBe(12500);
  });

  it('PUT /api/v1/inventory/:id should update product stock & price', async () => {
    const res = await request(app)
      .put(`/api/v1/inventory/${createdProdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        quantity: 25,
        unitPrice: 13000,
        buyingPrice: 9200,
      });
    expect(res.status).toBe(200);
    expect(res.body.product.quantity).toBe(25);
    expect(res.body.product.unitPrice).toBe(13000);
  });

  it('POST /api/v1/inventory/import-csv should bulk import items', async () => {
    const csvData = `Part Number,Price\nCSV-${timestamp}-1,4500\nCSV-${timestamp}-2,6800`;
    const res = await request(app)
      .post('/api/v1/inventory/import-csv')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        category: 'Filters',
        brand: 'Bosch',
        csvContent: csvData,
      });
    expect(res.status).toBe(200);
    expect(res.body.importedCount).toBe(2);
  });
});

describe('6. Suppliers & Supply Invoices (Purchases) CRUD', () => {
  let createdSupId = '';
  let supplierCode = '';

  it('POST /api/v1/suppliers should create supplier with auto code', async () => {
    const res = await request(app)
      .post('/api/v1/suppliers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Lanka Lubricants ${timestamp}`,
        contact: '+94 11 234 5678',
        invoice: 'MEMO-001',
      });
    expect(res.status).toBe(201);
    expect(res.body.supplier.supplierCode).toMatch(/^SUP-\d{4}$/);
    createdSupId = res.body.supplier._id || res.body.supplier.id;
    supplierCode = res.body.supplier.supplierCode;
  });

  it('GET /api/v1/suppliers should list suppliers with live balances', async () => {
    const res = await request(app)
      .get('/api/v1/suppliers')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.suppliers.length).toBeGreaterThan(0);
  });

  it('PUT /api/v1/suppliers/:id/invoice and PATCH should update supplier invoice memo', async () => {
    const resPut = await request(app)
      .put(`/api/v1/suppliers/${createdSupId}/invoice`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ invoice: 'UPDATED-MEMO-PUT' });
    expect(resPut.status).toBe(200);
    expect(resPut.body.supplier.invoice).toBe('UPDATED-MEMO-PUT');

    const resPatch = await request(app)
      .patch(`/api/v1/suppliers/${createdSupId}/invoice`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ invoice: 'UPDATED-MEMO-PATCH' });
    expect(resPatch.status).toBe(200);
    expect(resPatch.body.supplier.invoice).toBe('UPDATED-MEMO-PATCH');
  });

  it('POST /api/v1/supply-invoices should record purchase and increment stock', async () => {
    const prodBefore = await prisma.product.findFirst({ where: { itemName: 'Engine Oil' } });
    const qtyBefore = prodBefore?.quantity || 0;

    const res = await request(app)
      .post('/api/v1/supply-invoices')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        invoiceNo: `SUP-INV-${timestamp}`,
        supplierCode,
        itemId: prodBefore?.itemId,
        buyingPrice: 9100,
        quantity: 10,
        paymentStatus: 'Cheque',
        chequeNo: 'CHQ-98765',
        bankCode: '7010',
        branchCode: '001',
        valueDate: new Date().toISOString(),
      });
    expect(res.status).toBe(201);

    // Verify stock incremented by 10
    const prodAfter = await prisma.product.findUnique({ where: { itemId: prodBefore?.itemId } });
    expect(prodAfter?.quantity).toBe(qtyBefore + 10);
  });

  it('POST /api/v1/suppliers/settle should settle supplier movements', async () => {
    const movements = await prisma.stockMovement.findMany({ where: { supplierCode } });
    if (movements.length > 0) {
      const res = await request(app)
        .post('/api/v1/suppliers/settle')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ movementIds: [movements[0].id] });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });

  it('POST /api/v1/supply-invoices/settle should settle mature cheque supply invoices', async () => {
    const supplyInvs = await prisma.supplyInvoice.findMany({ where: { supplierCode } });
    if (supplyInvs.length > 0) {
      const res = await request(app)
        .post('/api/v1/supply-invoices/settle')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ invoiceIds: [supplyInvs[0].id] });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });
});

describe('7. POS Billing & Invoicing Engine (Complete Workflow)', () => {
  let createdInvoiceId = '';
  let testItemId = '';
  let initialStock = 0;

  it('POST /api/v1/invoices should create invoice with stock deduction and cost freezing', async () => {
    const prod = await prisma.product.findFirst({ where: { itemName: 'Engine Oil' } });
    expect(prod).toBeDefined();
    testItemId = prod!.itemId;
    initialStock = prod!.quantity;

    const res = await request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        customerName: `VIP Client ${timestamp}`,
        customerPhone: '0711112222',
        vehicleNo: `WP-KV-${timestamp.toString().slice(-4)}`,
        vehicleType: 'Car',
        items: [
          {
            service: 'Engine Oil Change',
            itemId: testItemId,
            description: prod?.brand,
            qty: 4,
            rate: 13000, // 4 * 13000 = 52000
          },
          {
            service: 'General Inspection',
            itemId: '',
            description: '15-point computerized safety inspection',
            qty: 1,
            rate: 3000, // 3000
          },
        ],
        discount: 2000,
        paymentMethod: 'Credit',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const inv = res.body.invoice;
    createdInvoiceId = inv._id || inv.id;
    expect(inv.subtotalAmount).toBe(55000); // 52000 + 3000
    expect(inv.discountAmount).toBe(2000);
    expect(inv.totalAmount).toBe(53000); // 55000 - 2000
    expect(inv.paymentStatus.toLowerCase()).toBe('unpaid');

    // Verify buying price was frozen on item row
    const oilItem = inv.items.find((i: any) => i.itemId === testItemId);
    expect(oilItem.buyingPrice).toBeGreaterThan(0);

    // Verify stock deducted by 4
    const prodAfter = await prisma.product.findUnique({ where: { itemId: testItemId } });
    expect(prodAfter?.quantity).toBe(initialStock - 4);
  });

  it('GET /api/v1/invoices/:id should fetch complete invoice details', async () => {
    const res = await request(app)
      .get(`/api/v1/invoices/${createdInvoiceId}`)
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.invoice.billNo).toMatch(/^INV-\d{14}/);
    expect(res.body.invoice.totalAmount).toBe(53000);
    expect(res.body.invoice.items.length).toBe(2);
  });

  it('PUT /api/v1/invoices/:id/settle should settle individual credit invoice', async () => {
    const res = await request(app)
      .put(`/api/v1/invoices/${createdInvoiceId}/settle`)
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.invoice.paymentStatus).toBe('Paid');
  });

  it('DELETE /api/v1/invoices/:id should delete invoice and restore stock', async () => {
    const prodBeforeDelete = await prisma.product.findUnique({ where: { itemId: testItemId } });
    const stockBeforeDelete = prodBeforeDelete?.quantity || 0;

    const res = await request(app)
      .delete(`/api/v1/invoices/${createdInvoiceId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Stock was 4 items on that invoice, so stock must be restored by 4
    const prodAfterDelete = await prisma.product.findUnique({ where: { itemId: testItemId } });
    expect(prodAfterDelete?.quantity).toBe(stockBeforeDelete + 4);
  });
});

describe('8. Profit & Loss Statement Reconciliation', () => {
  it('GET /api/v1/profit-statement should return accurate revenue, COGS, and profit', async () => {
    // Generate a quick fresh invoice to ensure current month has data
    await request(app)
      .post('/api/v1/invoices')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerName: `Reconcile Cust ${timestamp}`,
        vehicleNo: 'WP-REC-001',
        items: [
          { service: 'Standard Labor', itemId: '', qty: 1, rate: 5000, amount: 5000 },
        ],
        discount: 0,
        paymentMethod: 'Cash',
      });

    const res = await request(app)
      .get('/api/v1/profit-statement')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const stmt = res.body.statement;

    expect(stmt.totalSalesRevenue).toBe(Math.round((stmt.serviceRevenue + stmt.partsRevenue) * 100) / 100);
    expect(stmt.grossProfit).toBe(Math.round((stmt.totalSalesRevenue - stmt.cogs) * 100) / 100);
    expect(stmt.netProfitAfterPurchases).toBe(Math.round((stmt.grossProfit - stmt.totalPurchases) * 100) / 100);
    expect(stmt.lines.length).toBeGreaterThan(0);
  });
});

describe('9. Dashboard Analytics API', () => {
  it('GET /api/v1/dashboard/metrics should return summary metrics', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/metrics')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(res.body.metrics.customers).toBeGreaterThanOrEqual(0);
    expect(res.body.metrics.invoices).toBeGreaterThanOrEqual(0);
    expect(res.body.metrics.revenue).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/v1/dashboard/recent-invoices should return recent bills', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/recent-invoices')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.invoices)).toBe(true);
  });

  it('GET /api/v1/dashboard/charts should return sales trends and payment breakdowns', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard/charts')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.charts.dailyTrend)).toBe(true);
    expect(Array.isArray(res.body.charts.paymentMethods)).toBe(true);
  });
});

describe('10. Settings, Branding Profile & Purge API', () => {
  it('GET /api/v1/settings and GET /api/v1/settings/profile should return business profile', async () => {
    const res1 = await request(app)
      .get('/api/v1/settings')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res1.status).toBe(200);
    expect(res1.body.settings.businessName).toBeDefined();

    const res2 = await request(app)
      .get('/api/v1/settings/profile')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res2.status).toBe(200);
    expect(res2.body.profile.businessName).toBeDefined();
  });

  it('PUT /api/v1/settings/profile should update business profile (Admin)', async () => {
    const res = await request(app)
      .put('/api/v1/settings/profile')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        businessName: 'ISURU Auto Service Center',
        businessAddress: '123 High Level Road, Maharagama',
        businessPhone: '+94 11 285 5555',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/v1/settings/purge should support guarded supplier purge', async () => {
    const res = await request(app)
      .post('/api/v1/settings/purge')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ type: 'suppliers' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Suppliers data purged');
  });
});
