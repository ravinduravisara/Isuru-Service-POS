// ==============================================================================
// ISURU SERVICE CENTER POS: CLOUD & LOCAL SYNCHRONIZATION ROUTES
// ==============================================================================
import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  pushOutbox,
  pullChanges,
  triggerSync,
  getSyncStatus,
  syncInvoice,
} from './sync.controller.js';

export const syncRouter = Router();

// Batch Outbox Push: Billing computer pushes local operations to cloud Neon DB
syncRouter.post('/push', pushOutbox);

// Incremental Pull: Billing computer pulls master reference updates from cloud
syncRouter.get('/pull', pullChanges);

// Immediate Sync Trigger: Triggered by manual "Sync Now" button or auto-reconnect
syncRouter.post('/trigger', authenticate, triggerSync);

// Health & Operational Metrics: Status badge and diagnostic monitoring
syncRouter.get('/status', getSyncStatus);

// Direct single-invoice sync (backward compatibility with PWA)
syncRouter.post('/invoices', authenticate, syncInvoice);
