import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ENV = {
  PORT: parseInt(process.env.PORT || '5050', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/isuru_billing',
  JWT_SECRET: process.env.JWT_SECRET || 'isuru_service_center_super_secret_jwt_key_2026_production',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SQLITE_DB_PATH:
    process.env.SQLITE_DB_PATH ||
    path.resolve(
      __dirname,
      '../../../../ISURU-Service-Center-Billing-System-Offline-Software-/ServiceStationBillingApp/bin/Debug/net10.0-windows/billing.db'
    ),
  UPLOAD_DIR: path.resolve(__dirname, '../../uploads'),
};
