import mongoose from 'mongoose';
import { ENV } from './env.js';

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(ENV.MONGODB_URI);
    console.log(`[Database] MongoDB connected successfully to ${ENV.MONGODB_URI}`);
  } catch (error) {
    console.error('[Database] MongoDB connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('[Database] MongoDB disconnected');
}
