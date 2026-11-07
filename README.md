# ISURU Service Center - Point of Sale & Workshop Management System

> Production-ready, enterprise-grade automotive service station Point of Sale (POS) and inventory management platform built with **PostgreSQL**, **Prisma ORM**, **Express.js**, and **React 18 (Vite + TypeScript + TailwindCSS)**.

---

## 1. Project Overview

The ISURU Service Center Billing System is a business management and point-of-sale platform tailored for automotive service center operations. It provides high-speed counter POS invoicing, live vehicle and customer registration, inventory tracking with automated stock decrements, frozen buying-cost accounting, supplier accounts payable ledgers, and an itemized Profit & Loss statement.

### Key Architectural Capabilities
- **Relational PostgreSQL Engine:** Normalized 11-table PostgreSQL relational schema with foreign key integrity, indexes, and version-controlled Prisma migrations.
- **Exact Financial Precision:** Exact `DECIMAL(12, 2)` arithmetic for all buying prices, selling rates, invoice totals, discounts, and supplier balances — zero floating-point discrepancies.
- **Atomic Database Transactions:** Concurrency-guarded billing transactions (`prisma.$transaction`) ensuring synchronized invoice creation, stock decrements, and historical cost-basis freezing.
- **Production Containerization:** Fully containerized stack orchestrated via Docker Compose, multi-stage Alpine Docker builds, and Nginx reverse proxy with IP-based TLS configuration.
- **Automated Backups & Recovery:** Versioned `pg_dump` backup scripts with gzip compression, SHA256 integrity verification, and 14-day automated retention rotation.
- **High-Speed Counter POS Billing:** Hardware keyboard-driven POS counter (`F2`, `Ctrl+S`, `Escape`) with instant A4 Tax Invoice and 58mm/80mm Thermal Receipt rollback printing.
- **Comprehensive Automated Testing:** 41 Vitest integration tests covering authentication, role guarding, customer/vehicle relations, inventory mutations, supplier ledger settlements, and profit statement accounting.

---

## 2. System Architecture & Tech Stack

```mermaid
graph TD
    Client["React 18 SPA (Vite + TypeScript + TailwindCSS)"]
    Nginx["Nginx Reverse Proxy (Port 8443 HTTPS)"]
    API["Express.js REST API (Node.js + TypeScript)"]
    Prisma["Prisma ORM 6.19"]
    DB[("PostgreSQL 16 Database")]

    Client -->|HTTPS / JSON + JWT| Nginx
    Nginx -->|Proxy Pass /api/| API
    API -->|Prisma Client| Prisma
    Prisma -->|Connection Pool| DB
```

### Backend (`/backend`)
- **Runtime:** Node.js (ES Modules, TypeScript 5.7)
- **Framework:** Express.js 4.21
- **Database & ORM:** PostgreSQL 16 + Prisma ORM 6.19
- **Security:** `bcryptjs` password hashing, `jsonwebtoken` (JWT), HTTP security headers (`nosniff`, `SAMEORIGIN`), brute-force rate limiting (`express-rate-limit`)
- **File Uploads:** `multer` for official workshop logos
- **Testing:** `vitest` integration test suite with 41 comprehensive tests

### Frontend (`/frontend`)
- **Framework:** React 18 with Vite 6
- **Routing:** `react-router-dom` v7 with role-guarded `ProtectedRoute`
- **Styling:** TailwindCSS 3.4 with custom `@media print` typography
- **State & Caching:** Zustand for authentication session, `@tanstack/react-query` for data fetching
- **Charts:** `recharts` for 30-day daily sales trend and payment distribution
- **Icons:** `lucide-react`

---

## 3. User Roles & Default Credentials

| Role | Default Username | Default Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin` | `admin123` | Full system access, service rate catalog editing, financial profit statement, settings & credentials, data purge |
| **Service Staff** | `staff` | `staff123` | High-speed POS counter billing, view invoices, customer search, inventory lookup |

*Note: Credentials can be updated at any time by the Administrator in **Settings > Security & Passwords**.*

---

## 4. Quick Start & Local Execution

### Prerequisites
1. **Node.js**: v18.0.0 or higher (`node -v`)
2. **PostgreSQL**: PostgreSQL 14+ running locally on port `5432` (or via Docker)

### Step 1: Install Dependencies
From the repository root:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 2: Environment Configuration
Create `.env` inside `backend/` (or copy from `backend/.env.example`):
```env
PORT=5050
NODE_ENV=development
DATABASE_URL=postgresql://isuru_user:isuru_password@localhost:5432/isuru_pos?schema=public
JWT_SECRET=supersecretjwtkey_replace_in_production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:8081
```

### Step 3: Apply Database Migrations & Seed Data
```bash
cd backend
npx prisma migrate deploy
npm run seed
cd ..
```

### Step 4: Run Automated Tests
Execute the 41 integration tests against the local database:
```bash
npm test
```

### Step 5: Start the Development Server
Start both backend (`http://localhost:5050`) and frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```
Navigate to: **`http://localhost:5173`**

### Step 6: Production Build
```bash
npm run build
npm start
```

---

## 5. Docker Deployment & Orchestration

> **Note:** All Dockerfiles, Nginx configurations, and Compose stacks reside on the dedicated **`deployment`** branch.

To run the complete containerized stack locally:
```bash
git checkout deployment
docker compose up --build -d
```
Access the local containerized application:
- Frontend: `http://localhost:8081`
- Backend Health: `http://localhost:8081/api/v1/health`

For remote Hostinger VPS deployment on port `8443` HTTPS, refer to the operations manual in [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 6. Database Backups & Disaster Recovery

Automated shell scripts for PostgreSQL database maintenance are located in `/scripts`:

### Manual or Cron Backup
```bash
./scripts/backup-postgres.sh
```
- Creates a timestamped, gzip-compressed dump in `backups/isuru_pos_backup_YYYYMMDD_HHMMSS.sql.gz`.
- Generates a SHA256 checksum file for cryptographic integrity verification.
- Automatically prunes backups older than 14 days.

### Restore Database
```bash
./scripts/restore-postgres.sh backups/isuru_pos_backup_YYYYMMDD_HHMMSS.sql.gz
```
- Verifies SHA256 checksum before restoration.
- Confirms user prompt before overwriting active database.

---

## 7. MongoDB Data Migration Tool

If migrating historical data from an existing MongoDB instance:
```bash
cd backend
# Dry run mode (read-only audit):
npm run migrate:mongo -- --dry-run

# Live migration:
npm run migrate:mongo
```
Migrates users, customers, vehicles, services, inventory products, suppliers, supply invoices, invoices, and stock movements with relational integrity and ObjectId-to-UUID preservation.

---

## 8. POS Counter Keyboard Shortcuts

The POS Billing Counter (`/billing`) is optimized for rapid checkout using hardware keyboard hotkeys:

- **`F2`**: Append a new service or inventory item line to the active bill.
- **`Ctrl+S` / `Cmd+S`**: Save the current invoice, deduct stock, freeze cost basis, and automatically launch the Print Preview modal.
- **`Escape`**: Dismiss active modals or clear selection.

---

## 9. Financial Calculations & Accounting Logic

1. **Item Line Amount:**
   $$\text{Amount} = \text{Quantity} \times \text{Rate}$$

2. **Invoice Subtotal & Grand Total:**
   $$\text{Subtotal} = \sum \text{Amount}$$
   $$\text{Grand Total} = \text{Subtotal} - \text{Discount}$$
   *(where $0 \le \text{Discount} \le \text{Subtotal}$)*

3. **Profit & Loss Statement (Admin View):**
   - **Labour Service Revenue:** Sum of line amounts where item is labour (no `itemId`).
   - **Parts Revenue:** Sum of line amounts where `itemId` is present in inventory.
   - **Cost of Goods Sold (COGS):** Sum of $(\text{Quantity} \times \text{Buying Price})$ frozen at sale time.
   - **Gross Profit:**
     $$\text{Gross Profit} = \text{Total Sales Revenue} - \text{COGS}$$
   - **Gross Margin Percentage:**
     $$\text{Profit Margin} = \left(\frac{\text{Gross Profit}}{\text{Total Sales Revenue}}\right) \times 100$$
   - **Net Profit After Purchases:**
     $$\text{Net Profit} = \text{Gross Profit} - \text{Total Purchases (Supply Invoices)}$$

---

## 10. Project Structure

```
ISURU Service/
├── backend/                  # Express.js REST API Server
│   ├── prisma/               # Prisma schema & SQL migrations
│   │   ├── migrations/       # Version-controlled PostgreSQL DDL migrations
│   │   └── schema.prisma     # 11 normalized relational models
│   ├── src/
│   │   ├── config/           # Database, Prisma client & environment constants
│   │   ├── middleware/       # JWT Auth, rate limiter & error handlers
│   │   ├── modules/          # Business domain controllers & routers
│   │   │   ├── auth/
│   │   │   ├── customers/
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── invoices/
│   │   │   ├── profit/
│   │   │   ├── services/
│   │   │   ├── settings/
│   │   │   ├── suppliers/
│   │   │   ├── supplyInvoices/
│   │   │   └── vehicles/
│   │   ├── scripts/          # MongoDB migration & database seed scripts
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server entrypoint (Port 5050)
│   ├── tests/                # 41 Vitest integration API tests
│   └── package.json
│
├── frontend/                 # React 18 SPA (Vite + TailwindCSS)
│   ├── src/
│   │   ├── app/              # Router & QueryClient application shell
│   │   ├── components/       # Layouts, UI modals, badges, print dialogs
│   │   ├── pages/            # 10 production application pages
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── BillingPage.tsx
│   │   │   ├── InvoicesPage.tsx
│   │   │   ├── CustomersPage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   ├── InventoryPage.tsx
│   │   │   ├── SuppliersPage.tsx
│   │   │   ├── SupplyInvoicesPage.tsx
│   │   │   ├── ProfitStatementPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── services/         # Axios API client with token interceptor
│   │   ├── store/            # Zustand auth state store
│   │   └── types/            # Shared TypeScript data models
│   └── package.json
│
├── scripts/                  # Operational maintenance scripts
│   ├── backup-postgres.sh    # Automated pg_dump + gzip + SHA256 backup
│   ├── restore-postgres.sh   # Integrity-checked database restore
│   └── verify-deployment.sh  # Pre- and post-deployment validation suite
│
├── docs/                     # Technical specifications & architecture audits
├── shared/                   # Shared TypeScript constants & DTOs
├── package.json              # Root workspace orchestrator
├── DEPLOYMENT.md             # Hostinger VPS deployment & operations manual
└── README.md                 # System documentation
```

---

## 11. License & Ownership
Copyright © 2026 ISURU Service Center. All rights reserved.
Developed for automotive workshop billing, accounting, and inventory management.
