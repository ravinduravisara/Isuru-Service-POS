import { Router } from 'express';
import {
  getSupplyInvoices,
  createSupplyInvoice,
  settleSupplyInvoices,
} from './supplyInvoices.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export const supplyInvoicesRouter = Router();

supplyInvoicesRouter.get('/', authenticate, getSupplyInvoices);
supplyInvoicesRouter.post('/', authenticate, requireRole('Admin'), createSupplyInvoice);
supplyInvoicesRouter.post('/settle', authenticate, requireRole('Admin'), settleSupplyInvoices);
