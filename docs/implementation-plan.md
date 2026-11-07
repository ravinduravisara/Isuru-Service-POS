# ISURU Service Center - Comprehensive Implementation Plan

## 1. Architectural Blueprint
The new application will be structured as an enterprise MERN repository at `/Users/ravinduravisara/Documents/Github/ISURU-Service-Center-MERN` with modular clean architecture:

```
ISURU-Service-Center-MERN/
├── client/                     # Vite + React 18/19 + TypeScript + Tailwind CSS
│   ├── public/                 # Static assets, logos
│   ├── src/
│   │   ├── app/                # App entry, router, query provider
│   │   ├── components/         # Reusable UI, layout, tables, modal dialogs
│   │   ├── features/           # Feature slices (auth, billing, invoices, inventory, suppliers, services, profit, settings)
│   │   ├── hooks/              # Custom hooks (auth, keyboard shortcuts, print)
│   │   ├── services/           # Axios/Fetch API client
│   │   ├── store/              # Client state (Zustand / React Context)
│   │   └── types/              # Shared TypeScript definitions
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── server/                     # Node.js + Express + TypeScript + Mongoose
│   ├── src/
│   │   ├── config/             # DB connection, env variables
│   │   ├── models/             # Mongoose models (User, Customer, Vehicle, Invoice, Product, Supplier, etc.)
│   │   ├── modules/            # Domain controllers, routes, services (auth, billing, inventory, profit, etc.)
│   │   ├── middleware/         # Auth JWT/cookie, validation, role authorization, error handling
│   │   ├── utils/              # Decimal arithmetic, ID generators, PDF formatting
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # Server listener
│   ├── package.json
│   └── tsconfig.json
├── scripts/
│   └── migration/              # SQLite to MongoDB migration runner & verification
├── docs/                       # Architecture, features, parity matrix, migration plans
├── docker-compose.yml          # Containerized MongoDB + API + Frontend
├── package.json                # Root package.json with concurrent dev script
└── README.md                   # Full operational and deployment instructions
```

---

## 2. Implementation Phases

### Phase 1: Source Code Audit & Documentation (Completed)
- Thorough code analysis of both WinForms and Web legacy apps.
- Delivery of `source-code-analysis.md`, `existing-features.md`, `feature-parity-matrix.md`, `database-migration-plan.md`, and `implementation-plan.md`.

### Phase 2: Backend Core & Database Setup
1. Initialize `server/` with TypeScript, Express, Mongoose, Zod/Joi validation, JWT/cookie authentication, and logging.
2. Implement Mongoose models:
   - `User`, `Setting`, `Customer`, `Vehicle`, `Service`, `Product`, `Supplier`, `StockMovement`, `SupplyInvoice`, `Invoice`.
3. Implement core authentication & role authorization middleware (`authMiddleware`, `requireRole('Admin')`).
4. Implement all domain API routes & controllers:
   - `/api/v1/auth`: Login, Logout, Me.
   - `/api/v1/dashboard`: Counter metrics, recent invoices, revenue charts.
   - `/api/v1/customers`: CRUD, search, history drill-down.
   - `/api/v1/vehicles`: Search, customer association.
   - `/api/v1/services`: Category-filtered list, CRUD.
   - `/api/v1/inventory`: Product catalog, search, lookup by item ID, auto-ID generation, CRUD, CSV import.
   - `/api/v1/suppliers`: Directory, balances, CRUD, payment details, settlement.
   - `/api/v1/supply-invoices`: Create purchase invoice, auto-inventory increment, settlement.
   - `/api/v1/invoices`: POS bill saving with MongoDB transaction (atomic invoice creation + stock decrement), listing, filter, creditor settlement, drill-down.
   - `/api/v1/profit-statement`: Itemized revenue, COGS, gross profit, supply purchases, net profit.
   - `/api/v1/settings`: Company profile, logo upload, user credentials update, database purge.

### Phase 3: SQLite to MongoDB Migration Engine
1. Implement `scripts/migration/migrate.ts` using `better-sqlite3` and `mongoose`.
2. Map all 10 legacy SQLite tables into MongoDB collections.
3. Validate migrated record counts, financial totals, and data integrity.

### Phase 4: Frontend Development
1. Initialize `client/` using Vite, React, TypeScript, Tailwind CSS, Lucide React, and shadcn-inspired components.
2. Build layout system:
   - Deep navy sidebar (#0F172A / #1E293B) with responsive collapse.
   - Top navigation bar with active role badge, user profile, and quick actions.
   - Toast notifications, confirmation dialogs, loading skeletons.
3. Build all module screens:
   - **Login**: Clean login card with quick-fill demo buttons for Admin and User.
   - **Dashboard**: Modern SaaS KPI cards, recent invoice table, revenue/profit analytics charts.
   - **POS Billing Screen**:
     - Customer autocomplete with instant inline registration.
     - Vehicle type selection & vehicle number input.
     - Dynamic line items grid with auto-calculation, rate lookup from services or inventory.
     - Subtotal, discount, grand total panel, payment method selection.
     - Full desktop keyboard shortcuts (`Ctrl+S`, `F2`, `Esc`, `Ctrl+H`).
     - Save bill & Instant Print modal.
   - **Invoices / History**:
     - Filter by date range, search query, payment method.
     - Creditors only tab with batch "Mark Settled".
     - Detailed modal view and reprint options.
   - **Printing & PDF**:
     - Standard A4 invoice template with company logo, header, breakdown, totals.
     - Thermal receipt mode (58mm/80mm monospace POS slip).
   - **Inventory Management**:
     - Stock table with low-stock badges, selling vs buying prices, valuation summary.
     - Add/Edit modal with auto ID generator (`CAT-0001`).
     - CSV import dialog & PDF export.
   - **Suppliers & Supply Invoices**:
     - Supplier directory with cash, credit, cheque totals.
     - Supplier payment details modal with settlement actions.
     - Supply invoice purchase form with cheque bank details.
   - **Services Management**:
     - Service rate table filtered by vehicle type (Car, Bike, Van, Bus, Lorry, Others).
     - Add/Edit service modal.
   - **Profit & Loss Statement**:
     - Date range filter, itemized statement table with color-coded profit.
     - Summary KPI breakdown (Service Revenue, Parts Revenue, COGS, Gross Profit, Total Purchases, Net Profit).
     - Printable and exportable view.
   - **Customers & Vehicle History**:
     - Customer table, vehicle links, and invoice history drilldown.
   - **Settings**:
     - Business details (name, address, phone), logo upload, credential update, system reset.

### Phase 5: Automated Testing & Verification
1. Server unit & integration tests with Vitest/Supertest.
2. Full business workflow tests:
   - Admin login -> Add customer -> Register vehicle -> Add stock -> Bill service with stock deduction -> Verify stock deduction -> Verify profit statement -> Settle credit bill -> Verify reports.
3. Financial calculation tests for exact decimal arithmetic.

### Phase 6: Deployment & Offline Support
1. Docker Compose setup for complete offline/online deployment.
2. Root `npm run dev` script using `concurrently` to run both frontend and backend seamlessly.
3. Comprehensive deployment and operations guide.
