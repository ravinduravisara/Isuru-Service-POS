import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawNodeEnv = process.env.NODE_ENV || 'development';
const isProduction = rawNodeEnv === 'production';

// Strict schema validation for environment variables
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5050),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/isuru_billing'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:8081,http://127.0.0.1:5050,http://localhost:5050,https://88.222.242.20:8443'),
  UPLOAD_DIR: z.string().default(path.resolve(__dirname, '../../uploads')),
  INITIAL_ADMIN_USERNAME: z.string().default('admin'),
  INITIAL_ADMIN_PASSWORD: z.string().default('Admin@ISURU2026!'),
  CLOUD_SYNC_URL: z.string().default('https://88.222.242.20:8443'),
  CLOUD_DATABASE_URL: z.string().default('postgresql://neondb_owner:npg_C4W3bIOTtwLK@ep-ancient-fire-a1avc551.ap-southeast-1.aws.neon.tech/isuru_pos?sslmode=require'),
  CLOUD_SYNC_ENABLED: z.coerce.boolean().default(true),
  CLOUD_SYNC_INTERVAL_MS: z.coerce.number().int().positive().default(10000),
  POS_DEVICE_ID: z.string().default('pos-main'),
  POS_ROLE: z.enum(['LOCAL_PRIMARY', 'CLOUD_HUB']).default('LOCAL_PRIMARY'),
});

// Default fallbacks for development/testing ONLY
const defaultDevDatabaseUrl = 'postgresql://isuru_user:isuru_password@localhost:5432/isuru_pos?schema=public';
const defaultDevJwtSecret = 'isuru_dev_secret_key_minimum_32_characters_for_jwt_security!';

const rawEnv = {
  PORT: process.env.PORT,
  NODE_ENV: rawNodeEnv,
  DATABASE_URL: process.env.DATABASE_URL || (isProduction ? undefined : defaultDevDatabaseUrl),
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || (isProduction ? undefined : defaultDevJwtSecret),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  INITIAL_ADMIN_USERNAME: process.env.INITIAL_ADMIN_USERNAME,
  INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD,
  CLOUD_SYNC_URL: process.env.CLOUD_SYNC_URL,
  CLOUD_DATABASE_URL: process.env.CLOUD_DATABASE_URL,
  CLOUD_SYNC_ENABLED: process.env.CLOUD_SYNC_ENABLED,
  CLOUD_SYNC_INTERVAL_MS: process.env.CLOUD_SYNC_INTERVAL_MS,
  POS_DEVICE_ID: process.env.POS_DEVICE_ID,
  POS_ROLE: process.env.POS_ROLE,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error('❌ [Environment Validation Error] Invalid configuration:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  throw new Error('Fatal: Invalid environment configuration. Application cannot start safely.');
}

// In production, enforce cryptographic strength on JWT_SECRET and reject insecure placeholder secrets
if (isProduction) {
  if (parsed.data.JWT_SECRET.length < 32) {
    throw new Error('Fatal: In production, JWT_SECRET must be at least 32 characters long for security.');
  }
  if (parsed.data.JWT_SECRET.includes('isuru_dev_secret') || parsed.data.JWT_SECRET.includes('default')) {
    throw new Error('Fatal: In production, default development JWT_SECRET cannot be used. Set a unique, secure secret.');
  }
}

export const ENV = {
  ...parsed.data,
  IS_PRODUCTION: isProduction,
  IS_TEST: rawNodeEnv === 'test',
  ALLOWED_ORIGINS: parsed.data.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean),
};
