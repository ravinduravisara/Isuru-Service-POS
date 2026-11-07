import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { BillingPage } from '../pages/BillingPage';
import { InvoicesPage } from '../pages/InvoicesPage';
import { CustomersPage } from '../pages/CustomersPage';
import { ServicesPage } from '../pages/ServicesPage';
import { InventoryPage } from '../pages/InventoryPage';
import { SuppliersPage } from '../pages/SuppliersPage';
import { SupplyInvoicesPage } from '../pages/SupplyInvoicesPage';
import { ProfitStatementPage } from '../pages/ProfitStatementPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <DashboardPage />,
          },
          {
            path: '/billing',
            element: <BillingPage />,
          },
          {
            path: '/invoices',
            element: <InvoicesPage />,
          },
          {
            path: '/customers',
            element: <CustomersPage />,
          },
          {
            path: '/services',
            element: <ServicesPage />,
          },
          {
            path: '/inventory',
            element: <InventoryPage />,
          },
          {
            path: '/suppliers',
            element: <SuppliersPage />,
          },
          {
            path: '/supply-invoices',
            element: <SupplyInvoicesPage />,
          },
          {
            element: <ProtectedRoute requiredRole="Admin" />,
            children: [
              {
                path: '/profit',
                element: <ProfitStatementPage />,
              },
              {
                path: '/settings',
                element: <SettingsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

