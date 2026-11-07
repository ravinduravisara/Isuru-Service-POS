import { Router } from 'express';
import { getDashboardMetrics, getRecentInvoices, getSalesCharts } from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.js';

export const dashboardRouter = Router();

dashboardRouter.get('/metrics', authenticate, getDashboardMetrics);
dashboardRouter.get('/recent-invoices', authenticate, getRecentInvoices);
dashboardRouter.get('/charts', authenticate, getSalesCharts);
