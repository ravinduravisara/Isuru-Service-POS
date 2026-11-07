import { Router } from 'express';
import {
  getServices,
  createService,
  updateService,
  deleteService,
  getServicePresets,
  createServicePreset,
  updateServicePreset,
  deleteServicePreset,
  getServiceTags,
  createServiceTag,
  updateServiceTag,
  deleteServiceTag,
} from './services.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export const servicesRouter = Router();

// Presets CRUD (must precede /:id)
servicesRouter.get('/presets', authenticate, getServicePresets);
servicesRouter.post('/presets', authenticate, requireRole('Admin'), createServicePreset);
servicesRouter.put('/presets/:name', authenticate, requireRole('Admin'), updateServicePreset);
servicesRouter.delete('/presets/:name', authenticate, requireRole('Admin'), deleteServicePreset);

// Package / Tag / Notes CRUD (must precede /:id)
servicesRouter.get('/tags', authenticate, getServiceTags);
servicesRouter.post('/tags', authenticate, requireRole('Admin'), createServiceTag);
servicesRouter.put('/tags/:name', authenticate, requireRole('Admin'), updateServiceTag);
servicesRouter.delete('/tags/:name', authenticate, requireRole('Admin'), deleteServiceTag);

// Services Catalog CRUD
servicesRouter.get('/', authenticate, getServices);
servicesRouter.post('/', authenticate, requireRole('Admin'), createService);
servicesRouter.put('/:id', authenticate, requireRole('Admin'), updateService);
servicesRouter.delete('/:id', authenticate, requireRole('Admin'), deleteService);
