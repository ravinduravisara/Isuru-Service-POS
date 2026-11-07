import { Router } from 'express';
import { getProfitStatement } from './profit.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';

export const profitRouter = Router();

profitRouter.get('/', authenticate, requireRole('Admin'), getProfitStatement);
