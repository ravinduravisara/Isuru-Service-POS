import { Router } from 'express';
import { getVehicles, createVehicle } from './vehicles.controller.js';
import { authenticate } from '../../middleware/auth.js';

export const vehiclesRouter = Router();

vehiclesRouter.get('/', authenticate, getVehicles);
vehiclesRouter.post('/', authenticate, createVehicle);
