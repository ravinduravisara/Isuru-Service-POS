import { Router } from 'express';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  updateSupplierInvoice,
  deleteSupplier,
  getSupplierMovements,
  settleMovements,
} from './suppliers.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export const suppliersRouter = Router();

suppliersRouter.get('/', authenticate, getSuppliers);
suppliersRouter.post('/', authenticate, requireRole('Admin'), createSupplier);
suppliersRouter.put('/:id', authenticate, requireRole('Admin'), updateSupplier);
suppliersRouter.patch('/:id/invoice', authenticate, updateSupplierInvoice);
suppliersRouter.put('/:id/invoice', authenticate, updateSupplierInvoice);
suppliersRouter.delete('/:id', authenticate, requireRole('Admin'), deleteSupplier);
suppliersRouter.get('/:supplierCode/movements', authenticate, getSupplierMovements);
suppliersRouter.post('/settle', authenticate, requireRole('Admin'), settleMovements);
suppliersRouter.post('/settle-movements', authenticate, requireRole('Admin'), settleMovements);
