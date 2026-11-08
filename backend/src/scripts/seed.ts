import { seedDatabaseIfNeeded } from '../services/seed.service.js';
import { prisma } from '../config/prisma.js';

async function main() {
  console.log('Seeding initial PostgreSQL database from production dataset...');
  await seedDatabaseIfNeeded();
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
