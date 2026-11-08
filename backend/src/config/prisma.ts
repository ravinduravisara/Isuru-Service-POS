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
  console.log('[Database] PostgreSQL disconnected');
}
