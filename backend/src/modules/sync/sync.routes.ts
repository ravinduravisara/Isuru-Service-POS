// ==============================================================================
// ISURU SERVICE CENTER POS: OFFLINE SYNCHRONIZATION ROUTES
// ==============================================================================
import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { syncInvoice, getSyncStatus } from './sync.controller.js';

export const syncRouter = Router();

syncRouter.post('/invoices', authenticate, syncInvoice);
syncRouter.get('/status', authenticate, getSyncStatus);
