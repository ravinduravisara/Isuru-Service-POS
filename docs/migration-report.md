# ISURU Service Center - Data Migration Audit Report

- **Date of Execution**: 2026-10-30T07:06:43.211Z
- **Source Database**: `/Users/ravinduravisara/Documents/Github/ISURU-Service-Center-Billing-System-Offline-Software-/ServiceStationBillingApp/bin/Debug/net10.0-windows/billing.db`
- **Target Database**: `mongodb://127.0.0.1:27017/isuru_billing`

## Table & Collection Reconciliation

| Entity | SQLite Records | Migrated | MongoDB Records | Status |
|---|---|---|---|---|
| Customers | 1 | 1 | 1 | MATCH |
| Vehicles | 2 | 2 | 2 | MATCH |
| Services | 26 | 26 | 26 | MATCH |
| Inventory / Products | 0 | 0 | 0 | MATCH |
| Suppliers | 2 | 2 | 2 | MATCH |
| Stock Movements | 6 | 6 | 6 | MATCH |
| Supply Invoices | 4 | 4 | 4 | MATCH |
| Invoices | 2 | 2 | 2 | MATCH |
| Settings / Users | 4 | Admin & User Seeded | Active | MATCH |

## Financial & Referential Integrity
- All foreign keys between customers, vehicles, and invoices converted cleanly to MongoDB ObjectIds.
- Line items embedded into invoices with preserved prices and rates.
- Historical cost basis (COGS) snapshots preserved.
