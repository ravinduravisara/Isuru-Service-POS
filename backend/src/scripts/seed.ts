import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { DEFAULT_SERVICES } from '../config/constants.js';

async function main() {
  console.log('Seeding initial PostgreSQL database...');

  // 1. Initial Settings
  const defaultSettings = [
    { key: 'business_name', value: 'Isuru Service Center' },
    { key: 'business_address', value: 'No. 123, Main Street, Colombo, Sri Lanka' },
    { key: 'business_phone', value: '+94-77-1234567' },
    { key: 'admin_username', value: 'Isuru@6800' },
    { key: 'admin_password', value: 'Isuru@service' },
    { key: 'user_username', value: 'User@123' },
    { key: 'user_password', value: 'User@service' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('✔ Settings seeded');

  // 2. Initial Admin & User Accounts
  const adminHash = await bcrypt.hash('Isuru@service', 10);
  await prisma.user.upsert({
    where: { username: 'Isuru@6800' },
    update: { passwordHash: adminHash, role: 'Admin' },
    create: {
      username: 'Isuru@6800',
      passwordHash: adminHash,
      role: 'Admin',
      fullName: 'System Administrator',
    },
  });

  const staffHash = await bcrypt.hash('User@service', 10);
  await prisma.user.upsert({
    where: { username: 'User@123' },
    update: { passwordHash: staffHash, role: 'User' },
    create: {
      username: 'User@123',
      passwordHash: staffHash,
      role: 'User',
      fullName: 'Service Staff',
    },
  });
  console.log('✔ Users seeded (Admin: Isuru@6800, User: User@123)');

  // 3. Initial Services
  for (const svc of DEFAULT_SERVICES) {
    await prisma.service.upsert({
      where: { category_name: { category: svc.category, name: svc.name } },
      update: { price: svc.price },
      create: {
        category: svc.category,
        name: svc.name,
        price: svc.price,
        description: '',
      },
    });
  }
  console.log(`✔ ${DEFAULT_SERVICES.length} Default service rates seeded`);

  console.log('Database seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
