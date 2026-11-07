import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { DEFAULT_SERVICES } from '../config/constants.js';

async function main() {
  console.log('Seeding initial PostgreSQL database...');

  // 1. Initial Settings (Metadata only - zero plaintext passwords)
  const defaultSettings = [
    { key: 'business_name', value: 'Isuru Service Center' },
    { key: 'business_address', value: 'No. 123, Main Street, Colombo, Sri Lanka' },
    { key: 'business_phone', value: '+94-77-1234567' },
    { key: 'admin_username', value: 'admin' },
    { key: 'user_username', value: 'staff' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('✔ Settings seeded');

  // 2. Initial Admin & User Accounts (Salted bcrypt hashing - zero plaintext passwords)
  const legacyAdminHash = await bcrypt.hash('Isuru@service', 12);
  await prisma.user.upsert({
    where: { username: 'Isuru@6800' },
    update: { passwordHash: legacyAdminHash, role: 'Admin' },
    create: {
      username: 'Isuru@6800',
      passwordHash: legacyAdminHash,
      role: 'Admin',
      fullName: 'System Administrator',
    },
  });

  const legacyStaffHash = await bcrypt.hash('User@service', 12);
  await prisma.user.upsert({
    where: { username: 'User@123' },
    update: { passwordHash: legacyStaffHash, role: 'User' },
    create: {
      username: 'User@123',
      passwordHash: legacyStaffHash,
      role: 'User',
      fullName: 'Service Staff',
    },
  });

  const adminHash = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { passwordHash: adminHash, role: 'Admin' },
    create: {
      username: 'admin',
      passwordHash: adminHash,
      role: 'Admin',
      fullName: 'Administrator',
    },
  });

  const staffHash = await bcrypt.hash('staff123', 12);
  await prisma.user.upsert({
    where: { username: 'staff' },
    update: { passwordHash: staffHash, role: 'User' },
    create: {
      username: 'staff',
      passwordHash: staffHash,
      role: 'User',
      fullName: 'Service Staff',
    },
  });
  console.log('✔ Users seeded (admin / staff and legacy Isuru accounts)');

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
