import { Router } from 'express';
import {
  getCustomers,
  searchCustomers,
  getCustomerById,
  getCustomerVehicles,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from './customers.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export const customersRouter = Router();

customersRouter.get('/', authenticate, getCustomers);
customersRouter.get('/search', authenticate, searchCustomers);
customersRouter.get('/:id', authenticate, getCustomerById);
customersRouter.get('/:id/vehicles', authenticate, getCustomerVehicles);
customersRouter.post('/', authenticate, createCustomer);
customersRouter.put('/:id', authenticate, updateCustomer);
customersRouter.delete('/:id', authenticate, requireRole('Admin'), deleteCustomer);
