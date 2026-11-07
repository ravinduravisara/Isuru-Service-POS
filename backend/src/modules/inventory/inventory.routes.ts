import { Router } from 'express';
import {
  getInventory,
  lookupByItemId,
  createProduct,
  updateProduct,
  deleteProduct,
  importCsv,
  getDistinctCategories,
} from './inventory.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export const inventoryRouter = Router();

inventoryRouter.get('/', authenticate, getInventory);
inventoryRouter.get('/categories', authenticate, getDistinctCategories);
inventoryRouter.get('/lookup', authenticate, lookupByItemId);
inventoryRouter.get('/lookup/:itemId', authenticate, lookupByItemId);
inventoryRouter.post('/', authenticate, requireRole('Admin'), createProduct);
inventoryRouter.put('/:id', authenticate, requireRole('Admin'), updateProduct);
inventoryRouter.delete('/:id', authenticate, requireRole('Admin'), deleteProduct);
inventoryRouter.post('/import-csv', authenticate, requireRole('Admin'), importCsv);
