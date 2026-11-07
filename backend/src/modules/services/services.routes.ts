import { Router } from 'express';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from './services.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export const servicesRouter = Router();

servicesRouter.get('/', authenticate, getServices);
servicesRouter.post('/', authenticate, requireRole('Admin'), createService);
servicesRouter.put('/:id', authenticate, requireRole('Admin'), updateService);
servicesRouter.delete('/:id', authenticate, requireRole('Admin'), deleteService);
