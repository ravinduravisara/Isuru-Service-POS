import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import { authRouter } from './modules/auth/auth.routes.js';
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

export const app = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local offline use
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
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/vehicles', vehiclesRouter);
app.use('/api/v1/services', servicesRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/suppliers', suppliersRouter);
app.use('/api/v1/supply-invoices', supplyInvoicesRouter);
app.use('/api/v1/invoices', invoicesRouter);
app.use('/api/v1/profit-statement', profitRouter);
app.use('/api/v1/settings', settingsRouter);

// Centralized error handling
app.use(errorHandler);
