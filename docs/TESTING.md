# ISURU Service Center POS: Automated Test Suite & Verification

## 1. Test Architecture

The test suite runs using **Vitest** with Supertest against an active test database instance.

```bash
cd backend
npm test
```

To run a specific test suite:
```bash
npx vitest run tests/sync-and-offline.test.ts
```

---

## 2. Test Suite Breakdown (57 Automated Tests)

### Suite 1: `tests/api.test.ts` (42 Tests)
Comprehensive regression test covering the complete automotive POS business lifecycle:
- **Authentication & RBAC**: Admin vs Staff role guarding, JWT validation.
- **Customers & Vehicles**: CRUD, phone validation (10 digits), Old/New NIC validation.
- **Service Rates**: Category filtering, CRUD, distinct category aggregation.
- **Inventory & Stock Deductions**: Stock increments, low-stock warnings, dual-code part matching.
- **Suppliers & Supply Invoices**: Vendor accounts, credit tracking, payment status.
- **POS Billing & Settlement Workflow**: Sequential bill allocation, line item calculation, partial/full credit settlements, invoice deletion with inventory restoration.
- **Profit & Loss Statement**: Gross revenue, COGS, and net margin reconciliation.
- **Settings & Business Profile**: Branding headers, safe data purging.

### Suite 2: `tests/security-and-inventory.test.ts` (6 Tests)
Hardened security and high-concurrency race condition testing:
- Plaintext password scrub verification in settings table.
- Initial admin setup lock when users exist.
- Bcrypt password hashing verification.
- Atomic stock locking (`SELECT ... FOR UPDATE`) preventing overselling under high concurrency.
- Transactional rollback when multi-item bill fails stock check.

### Suite 3: `tests/sync-and-offline.test.ts` (9 Tests)
Local-first transactional outbox and cloud synchronization verification:
- `/api/v1/sync/status` operational metrics reporting.
- Provisional bill synchronization with atomic cloud stock deduction.
- Idempotency verification: resending `clientTxId` returns existing invoice without duplicate stock deduction.
- Dual-code slash part numbers (`EO-24070 / LR004459`) resolution during sync.
- Conflict detection and audit logging when offline sales exceed cloud stock.
- Atomic `SyncOutbox` record creation on local invoice generation.
- Batch push protocol (`POST /api/v1/sync/push`) with idempotency check.
- Two-way incremental pull (`GET /api/v1/sync/pull`).
