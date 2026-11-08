// ==============================================================================
// ISURU SERVICE CENTER POS: PRODUCTION OFFLINE SEED SERVICE
// Seeds initial users, inventory, services, and settings from seed-data.json
// ==============================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedDatabaseIfNeeded(): Promise<void> {
  try {
    // 1. Ensure required users exist (Admin & Staff)
    const requiredUsers = [
      { username: 'Isuru@6800', password: 'Isuru@service', role: 'Admin', fullName: 'System Administrator' },
      { username: 'User@123', password: 'User@service', role: 'User', fullName: 'Service Staff' },
      { username: 'admin', password: 'admin123', role: 'Admin', fullName: 'Administrator' },
      { username: 'staff', password: 'staff123', role: 'User', fullName: 'Service Staff' },
    ];

    for (const u of requiredUsers) {
      const existing = await prisma.user.findUnique({ where: { username: u.username } });
      if (!existing) {
        const passwordHash = await bcrypt.hash(u.password, 12);
        await prisma.user.create({
          data: {
            username: u.username,
            passwordHash,
            role: u.role,
            fullName: u.fullName,
          },
        });
        console.log(`✔ [Seed] Provisioned user account: ${u.username} (${u.role})`);
      }
    }

    // 2. Check if products or services are seeded
    const productCount = await prisma.product.count();
    const serviceCount = await prisma.service.count();

    if (productCount > 0 && serviceCount > 0) {
      // Catalog already populated
      return;
    }

    // Locate seed-data.json across candidate directory layouts
    const candidatePaths = [
      path.resolve(__dirname, '../../prisma/seed-data.json'),
      path.resolve(__dirname, '../prisma/seed-data.json'),
      path.resolve(__dirname, 'prisma/seed-data.json'),
      path.resolve(process.cwd(), 'prisma/seed-data.json'),
      (process as any).resourcesPath
        ? path.join((process as any).resourcesPath, 'backend', 'prisma', 'seed-data.json')
        : null,
      path.resolve(process.cwd(), 'resources/backend/prisma/seed-data.json'),
    ].filter(Boolean) as string[];

    let seedJsonPath: string | null = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        seedJsonPath = p;
        break;
      }
    }

    if (!seedJsonPath) {
      console.warn('⚠ [Seed] seed-data.json not found in candidate paths. Skipping catalog seeding.');
      return;
    }

    console.log(`[Seed] Loading production seed catalog from: ${seedJsonPath}`);
    const seedData = JSON.parse(fs.readFileSync(seedJsonPath, 'utf8'));

    // Seed Settings
    if (seedData.settings?.length) {
      for (const s of seedData.settings) {
        await prisma.setting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value },
        });
      }
      console.log(`✔ [Seed] Seeded ${seedData.settings.length} system settings.`);
    }

    // Seed Suppliers
    if (seedData.suppliers?.length) {
      for (const sup of seedData.suppliers) {
        await prisma.supplier.upsert({
          where: { supplierCode: sup.supplierCode },
          update: { name: sup.name, contact: sup.contact, invoice: sup.invoice },
          create: {
            id: sup.id,
            supplierCode: sup.supplierCode,
            name: sup.name,
            contact: sup.contact || '',
            cashTotal: sup.cashTotal || 0,
            creditTotal: sup.creditTotal || 0,
            chequeTotal: sup.chequeTotal || 0,
            invoice: sup.invoice || '',
          },
        });
      }
      console.log(`✔ [Seed] Seeded ${seedData.suppliers.length} suppliers.`);
    }

    // Seed Services
    if (serviceCount === 0 && seedData.services?.length) {
      for (const svc of seedData.services) {
        await prisma.service.upsert({
          where: { category_name: { category: svc.category, name: svc.name } },
          update: { price: svc.price, description: svc.description || '' },
          create: {
            id: svc.id,
            category: svc.category,
            name: svc.name,
            price: svc.price,
            description: svc.description || '',
          },
        });
      }
      console.log(`✔ [Seed] Seeded ${seedData.services.length} services.`);
    }

    // Seed Products
    if (productCount === 0 && seedData.products?.length) {
      const chunkSize = 100;
      for (let i = 0; i < seedData.products.length; i += chunkSize) {
        const chunk = seedData.products.slice(i, i + chunkSize).map((p: any) => ({
          id: p.id,
          itemId: p.itemId,
          itemName: p.itemName,
          brand: p.brand || '',
          quantity: p.quantity || 0,
          unitPrice: p.unitPrice || 0,
          buyingPrice: p.buyingPrice || 0,
          supplierCode: p.supplierCode || '',
          paymentMethod: p.paymentMethod || 'Cash',
        }));

        await prisma.product.createMany({
          data: chunk,
          skipDuplicates: true,
        });
      }
      console.log(`✔ [Seed] Seeded ${seedData.products.length} inventory products.`);
    }

    console.log('✔ [Seed] Production offline database seeding completed successfully.');
  } catch (error) {
    console.error('⚠ [Seed] Error during automatic database seeding:', error);
  }
}
