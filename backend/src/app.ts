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

      // Always allow loopback origins for local operation, desktop Electron, and local frontend
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.startsWith('file://') ||
        origin.startsWith('vscode-file://') ||
        origin === 'null'
      ) {
        return callback(null, true);
      }

      // Check same-origin hostname
      try {
        const originUrl = new URL(origin);
        if (originUrl.hostname === '127.0.0.1' || originUrl.hostname === 'localhost') {
          return callback(null, true);
        }
      } catch {}

      // Validate against configured allowed origins
      const isAllowed = ENV.ALLOWED_ORIGINS.some((allowed) => {
        if (allowed === origin) return true;
        if (allowed.startsWith('*.')) {
          const domain = allowed.slice(2);
          return origin.endsWith(domain);
        }
        return false;
      });

      if (isAllowed || !ENV.IS_PRODUCTION || ENV.POS_ROLE === 'LOCAL_PRIMARY') {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} is not authorized.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
function resolveClientDistDir(): string | null {
  const candidates = [
    process.env.CLIENT_BUILD_DIR,
    (process as any).resourcesPath ? path.join((process as any).resourcesPath, 'frontend', 'dist') : null,
    path.resolve(process.cwd(), 'resources', 'frontend', 'dist'),
    path.resolve(process.cwd(), 'frontend', 'dist'),
    path.resolve(__dirname, '../../frontend/dist'),
    path.resolve(__dirname, '../frontend/dist'),
    path.resolve(__dirname, 'frontend/dist'),
    path.resolve(__dirname, '../../resources/frontend/dist'),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'index.html'))) {
      return candidate;
    }
  }
  return null;
}

const clientDistDir = resolveClientDistDir();
if (clientDistDir) {
  console.log(`[Frontend] Serving React UI bundle from: ${clientDistDir}`);
  app.use(
    express.static(clientDistDir, {
      maxAge: '1d',
      setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
      },
    })
  );
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(path.join(clientDistDir, 'index.html'));
  });
} else {
  console.warn('[Frontend] Notice: Compiled React UI distribution not found in candidate paths.');
}

// Centralized error handling
app.use(errorHandler);
