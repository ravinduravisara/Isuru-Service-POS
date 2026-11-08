import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import { authRouter } from './modules/auth/auth.routes.js';
import { authRateLimiter } from './middleware/rateLimiter.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';
import { customersRouter } from './modules/customers/customers.routes.js';
import { vehiclesRouter } from './modules/vehicles/vehicles.routes.js';
import { servicesRouter } from './modules/services/services.routes.js';
import { inventoryRouter } from './modules/inventory/inventory.routes.js';
import { suppliersRouter } from './modules/suppliers/suppliers.routes.js';
import { supplyInvoicesRouter } from './modules/supplyInvoices/supplyInvoices.routes.js';
import { invoicesRouter } from './modules/invoices/invoices.routes.js';
import { profitRouter } from './modules/profit/profit.routes.js';
import { settingsRouter } from './modules/settings/settings.routes.js';
import { syncRouter } from './modules/sync/sync.routes.js';

export const app = express();

// HTTP Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Validate against configured allowed origins
      const isAllowed = ENV.ALLOWED_ORIGINS.some((allowed) => {
        if (allowed === origin) return true;
        // In development/test mode, allow localhost and loopback interfaces
        if (!ENV.IS_PRODUCTION && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
          return true;
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} is not authorized.`));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(ENV.UPLOAD_DIR));

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ISURU Service Center API',
    version: '1.0.0',
  });
});

// Mount API modules
app.use('/api/v1/auth/login', authRateLimiter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/vehicles', vehiclesRouter);
app.use('/api/v1/vehicle-types', vehiclesRouter);
app.use('/api/v1/services', servicesRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/suppliers', suppliersRouter);
app.use('/api/v1/supply-invoices', supplyInvoicesRouter);
app.use('/api/v1/invoices', invoicesRouter);
app.use('/api/v1/profit-statement', profitRouter);
app.use('/api/v1/settings', settingsRouter);
app.use('/api/v1/sync', syncRouter);

// Serve compiled React SPA if present (Desktop Electron standalone or production bundle)
const clientDistDir = process.env.CLIENT_BUILD_DIR || path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistDir, 'index.html'));
  });
}

// Centralized error handling
app.use(errorHandler);
