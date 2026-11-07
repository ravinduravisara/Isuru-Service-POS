import { Router } from 'express';
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  settleInvoices,
  settleInvoiceById,
  deleteInvoice,
} from './invoices.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export const invoicesRouter = Router();

invoicesRouter.post('/', authenticate, createInvoice);
invoicesRouter.get('/', authenticate, getInvoices);
invoicesRouter.get('/:id', authenticate, getInvoiceById);
invoicesRouter.post('/settle', authenticate, settleInvoices);
invoicesRouter.put('/:id/settle', authenticate, settleInvoiceById);
invoicesRouter.delete('/:id', authenticate, requireRole('Admin'), deleteInvoice);
