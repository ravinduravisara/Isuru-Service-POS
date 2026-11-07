import { Router } from 'express';
import {
  getVehicles,
  createVehicle,
  getVehicleTypes,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType,
} from './vehicles.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export const vehiclesRouter = Router();

// Vehicle Types / Categories CRUD
vehiclesRouter.get('/types', authenticate, getVehicleTypes);
vehiclesRouter.post('/types', authenticate, requireRole('Admin'), createVehicleType);
vehiclesRouter.put('/types/:name', authenticate, requireRole('Admin'), updateVehicleType);
vehiclesRouter.delete('/types/:name', authenticate, requireRole('Admin'), deleteVehicleType);

// Customer Vehicles
vehiclesRouter.get('/', authenticate, getVehicles);
vehiclesRouter.post('/', authenticate, createVehicle);
