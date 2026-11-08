import { PrismaClient } from '@prisma/client';
import { ENV } from './env.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ENV.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (ENV.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function connectDB(retries = 5, delayMs = 1500): Promise<void> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      console.log('[Database] PostgreSQL connected successfully via Prisma');
      return;
    } catch (error) {
      lastError = error;
      console.warn(`[Database] PostgreSQL connection attempt ${attempt}/${retries} failed:`, error);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }
  console.error('[Database] PostgreSQL connection failed permanently:', lastError);
  throw lastError || new Error('Database connection failed');
}

export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
  if (cloudPrismaInstance) {
    await cloudPrismaInstance.$disconnect();
    cloudPrismaInstance = null;
  }
  console.log('[Database] PostgreSQL disconnected');
}

let cloudPrismaInstance: PrismaClient | null = null;

/**
 * Return singleton PrismaClient connected to the remote Neon Cloud PostgreSQL database.
 * Returns null if cloud sync is disabled or if local database is already the cloud database.
 */
export function getCloudPrisma(): PrismaClient | null {
  if (!ENV.CLOUD_SYNC_ENABLED || !ENV.CLOUD_DATABASE_URL) {
    return null;
  }
  if (ENV.DATABASE_URL === ENV.CLOUD_DATABASE_URL) {
    return null;
  }
  if (!cloudPrismaInstance) {
    cloudPrismaInstance = new PrismaClient({
      datasources: {
        db: { url: ENV.CLOUD_DATABASE_URL },
      },
      log: ['error'],
    });
  }
  return cloudPrismaInstance;
}
