# ISURU Service Center Billing System - Source Code Analysis

## 1. Executive Summary & Purpose
This document provides a deep, comprehensive architectural and code analysis of the existing ISURU Service Center Billing System (offline Windows desktop application and companion ASP.NET Core MVC web application). The goal of this analysis is to specify every component, database entity, business workflow, and edge case required to recreate the entire system faithfully as a modern, production-grade MERN (MongoDB, Express, React, Node.js + TypeScript) stack solution without missing any features.

---

## 2. Existing Repository Structure & Technology Stack

### 2.1 Repository Layout
The legacy repository (`ISURU-Service-Center-Billing-System-Offline-Software-`) contains two main sub-projects sharing the same SQLite database schema:
```
ISURU-Service-Center-Billing-System-Offline-Software-/
├── ServiceStationBillingApp/       # C# .NET 10 Windows Forms Desktop Application
│   ├── assets/                     # logo.png, AppIcon.ico
│   ├── Database.cs                 # Central SQLite data-access layer, schema init & migrations
│   ├── Program.cs                  # Entry point, CLI flags (--purge-all, --purge-suppliers, --db-counts)
│   ├── LoginForm.cs                # Authentication form & role dispatcher (Admin vs User)
│   ├── BillingForm.cs              # Core POS billing, keyboard shortcuts, printing & inventory deduction
│   ├── CustomersForm.cs            # Customer management, vehicle counts, search, CRUD
│   ├── CustomerEditDialog.cs       # Customer modal edit / create dialog
│   ├── InventoryForm.cs            # Stock & inventory tracking, CSV import, PDF export, auto-item IDs
│   ├── ServicesForm.cs             # Fixed labor rates & services by vehicle category (Car, Bike, etc.)
│   ├── SuppliersForm.cs            # Supplier balances (Cash, Credit, Cheque), inline invoice notes
│   ├── SupplierEditDialog.cs       # Supplier add/edit modal dialog
│   ├── SupplierPaymentDetailsForm.cs # Detail ledger of supplier purchases & payment settlement
│   ├── SupplyInvoicesForm.cs       # Supplier purchase invoices (cash, credit, cheque with bank details)
│   ├── InvoiceListForm.cs          # History list, payment method breakdown, credit settlement
│   ├── BillHistoryForm.cs          # Customer vehicle invoice history & drill-down
│   ├── InvoicePrintDialog.cs       # A4 print preview, thermal print & HTML export
│   ├── ProfitStatementForm.cs      # Revenue, COGS, Gross Profit, Purchases & Net Profit analysis + PDF
│   └── SettingsForm.cs             # Logo management & Admin/User credential updates
├── ServiceStationBillingWeb/       # C# ASP.NET Core 10 MVC Browser Application
│   ├── Controllers/
│   │   ├── AccountController.cs    # Cookie auth, credentials validation against app_settings
│   │   ├── DashboardController.cs  # High-level statistics (Customers, Vehicles, Invoices, Stock, Revenue)
│   │   ├── BillingController.cs    # Web billing entry, vehicle registration & stock deduction
│   │   ├── CustomersController.cs  # Customer listing & CRUD
│   │   ├── InventoryController.cs  # Stock listing & CRUD
│   │   ├── InvoicesController.cs   # Invoice listing, detail view, credit settlement
│   │   ├── ProfitController.cs     # Profit statement calculation & printable view
│   │   ├── ServicesController.cs   # Services listing & CRUD
│   │   ├── SettingsController.cs   # Password & credential settings
│   │   ├── SuppliersController.cs  # Supplier listing & balance sync
│   │   └── SupplyInvoicesController.cs # Supply invoices recording & settlement
│   ├── Models/                     # ViewModels for all controllers
│   ├── Views/                      # Razor views for UI
│   └── wwwroot/                    # Static assets & scripts
├── Dockerfile                      # Web deployment container configuration
└── README.md                       # Project overview documentation
```

---

## 3. SQLite Database Schema & Entity Relationships

The legacy application uses an SQLite database (`billing.db`) accessed synchronously using `Microsoft.Data.Sqlite`.

### 3.1 Tables and Constraints
1. **`customers`**
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `name` (TEXT NOT NULL)
   - `phone` (TEXT)

2. **`vehicles`**
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `customer_id` (INTEGER NOT NULL, FK -> `customers.id`)
   - `vehicle_no` (TEXT NOT NULL)
   - `vehicle_type` (TEXT: 'Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others')

3. **`invoices`**
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `bill_no` (TEXT NOT NULL) - format: `INV-yyyyMMddHHmmss` or manual
   - `customer_id` (INTEGER NOT NULL, FK -> `customers.id`)
   - `vehicle_id` (INTEGER NOT NULL, FK -> `vehicles.id`)
   - `date_time` (TEXT NOT NULL) - format: `yyyy-MM-dd HH:mm:ss`
   - `subtotal_amount` (REAL NOT NULL DEFAULT 0)
   - `discount_amount` (REAL NOT NULL DEFAULT 0)
   - `total_amount` (REAL NOT NULL)
   - `payment_method` (TEXT: 'Cash', 'Credit', 'Cheque', 'Card')
   - `payment_status` (TEXT: 'paid' / 'unpaid' / 'pending')
   - `payment_settled_at` (TEXT NULL)

4. **`invoice_items`**
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `invoice_id` (INTEGER NOT NULL, FK -> `invoices.id`)
   - `service` (TEXT)
   - `description` (TEXT)
   - `qty` (REAL)
   - `rate` (REAL)
   - `amount` (REAL)
   - `item_id` (TEXT NULL) - References `inventory.item_id`
   - `buying_price` (REAL NOT NULL DEFAULT 0) - Snapshotted at time of sale from inventory

5. **`inventory`**
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `item_id` (TEXT UNIQUE) - Format: 3-letter uppercase category prefix + '-' + 4-digit sequence, e.g. `ENG-0001`
   - `item_name` (TEXT NOT NULL) - Category name (e.g. "Engine Oil", "Brake Pad", "Filters")
   - `brand` (TEXT NULL) - Brand/model name
   - `quantity` (REAL NOT NULL DEFAULT 0) - Current stock level
   - `unit_price` (REAL NOT NULL DEFAULT 0) - Retail selling price
   - `buying_price` (REAL NOT NULL DEFAULT 0) - Cost price
   - `updated_at` (TEXT NOT NULL)
   - `supplier_code` (TEXT NULL) - References `suppliers.supplier_code`
   - `payment_method` (TEXT NULL: 'Cash', 'Credit', 'Cheque')

6. **`suppliers`**
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `supplier_code` (TEXT UNIQUE) - Format: `SUP-0001`
   - `name` (TEXT NOT NULL)
   - `contact` (TEXT NULL)
   - `cash_total` (REAL NOT NULL DEFAULT 0)
   - `credit_total` (REAL NOT NULL DEFAULT 0)
   - `cheque_total` (REAL NOT NULL DEFAULT 0)
   - `invoice` (TEXT NULL) - Invoice reference text

7. **`stock_movements`**
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `item_id` (TEXT NULL)
   - `supplier_code` (TEXT NULL)
   - `quantity` (REAL NOT NULL DEFAULT 0)
   - `unit_price` (REAL NOT NULL DEFAULT 0)
   - `buying_price` (REAL NOT NULL DEFAULT 0)
   - `payment_method` (TEXT NULL)
   - `moved_at` (TEXT NOT NULL)
   - `settled_at` (TEXT NULL)

8. **`supply_invoices`** (Purchases from suppliers)
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `invoice_no` (TEXT NOT NULL)
   - `supplier_code` (TEXT NOT NULL)
   - `item_id` (TEXT NOT NULL)
   - `buying_price` (REAL NOT NULL DEFAULT 0)
   - `quantity` (REAL NOT NULL DEFAULT 0)
   - `payment_status` (TEXT NOT NULL DEFAULT 'Cash' - 'Cash', 'Credit', 'Cheque')
   - `created_at` (TEXT NOT NULL)
   - `cheque_no` (TEXT NULL)
   - `branch_code` (TEXT NULL)
   - `bank_code` (TEXT NULL)
   - `value_date` (TEXT NULL)
   - `settled_at` (TEXT NULL)

9. **`services`**
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `category` (TEXT NOT NULL DEFAULT 'Others') - Car, Bike, Van, Bus, Lorry, Others
   - `name` (TEXT NOT NULL)
   - `price` (REAL NOT NULL DEFAULT 0)
   - `description` (TEXT NULL)
   - `UNIQUE(category, name)`

10. **`app_settings`**
    - `key` (TEXT PRIMARY KEY)
    - `value` (TEXT NOT NULL)
    - Default keys:
      - `admin_username`: `Isuru@6800`
      - `admin_password`: `Isuru@service`
      - `user_username`: `User@123`
      - `user_password`: `User@service`

---

## 4. Business Logic & Calculation Rules

### 4.1 Invoicing and POS Calculations
- **Line Item Amount**: `Amount = Quantity * Rate` (rounded to 2 decimal places).
- **Subtotal**: Sum of all line item amounts: `Subtotal = Σ(Amount)`.
- **Discount**: User entered discount. Must satisfy `0 <= Discount <= Subtotal`.
- **Grand Total**: `Total = Subtotal - Discount` (bounded below at 0).
- **Inventory Auto-Lookup**:
  - When a service item is added in Billing, if it is an inventory-rated service (`"Engine Oil Change"`, `"Filters Replacement"`, `"Custom Item"`), providing an `item_id` auto-populates `Rate` from `inventory.unit_price` and `Description` from `inventory.brand`.
  - For standard labor services, `Rate` is fetched from `services` based on vehicle category and service name.
- **Real-Time Stock Deduction**:
  - When an invoice is created, for every line item that has an `item_id` and `qty > 0`, the inventory quantity is deducted:
    `quantity = MAX(0, quantity - qty)`
  - The item's current `buying_price` is copied into `invoice_items.buying_price` to freeze the cost basis for accurate historical COGS and profit calculation.
- **Payment Method & Status**:
  - `Cash` / `Card` -> Status `Paid` / `paid`.
  - `Credit` -> Status `unpaid` / `Pending`.
  - `Cheque` -> Status `pending`.

### 4.2 Supplier Purchases & Supply Invoices
- When a `supply_invoice` is created:
  - Inventory quantity is incremented: `quantity = quantity + qty`.
  - `buying_price` is updated to the latest purchase price.
  - `supplier_code` and `payment_method` are updated on the item.
  - A record is added to `stock_movements`.
  - Supplier record is created if not already present.
  - Supplier balances (`cash_total`, `credit_total`, `cheque_total`) are updated.
- Supplier settlement:
  - Marking credit or cheque items settled stamps `settled_at = timestamp`.

### 4.3 Profit and Loss Calculations
- **Service Revenue (Labour)**: Sum of `amount` where `item_id IS NULL OR item_id = ''`.
- **Parts / Inventory Revenue**: Sum of `amount` where `item_id` is present.
- **Cost of Goods Sold (COGS)**: Sum of `qty * buying_price` for all items with `item_id`.
- **Total Sales Revenue**: `Service Revenue + Parts Revenue`.
- **Gross Profit**: `Total Sales Revenue - COGS`.
- **Profit Margin %**: `(Gross Profit / Total Sales Revenue) * 100` (if Total Sales > 0).
- **Total Purchases**: Sum of `buying_price * quantity` from `supply_invoices` in selected date window.
- **Net Profit (After Purchases)**: `Gross Profit - Total Purchases`.

---

## 5. Security & Role-Based Permissions
- Two predefined roles:
  1. **Admin**:
     - Full access to POS Billing, Customers, Vehicles, Services, Inventory, Suppliers, Supply Invoices, Invoices, Creditors Settlement, Profit & Loss Statements, Settings (credentials and logo), and System Diagnostics/Purge.
  2. **User (Staff)**:
     - Access to POS Billing, Viewing Invoices, Viewing Bill History, Customer Autocomplete.
     - Read-only access to Customers, Inventory, Suppliers, Services.
     - Strictly forbidden from: Add/Edit/Delete in Customers, Inventory, Services, Suppliers; forbidden from Settings and Profit Statement.

---

## 6. Document Formats & Printing
1. **Full A4 Invoice**:
   - Company Header: Logo (`assets/logo.png`), "Isuru Service Center", "Your Address Here", "Tel: +94-000-000000".
   - Invoice Title, Bill No, Date/Time, Customer Name, Contact Number, Vehicle No, Vehicle Type.
   - Line items table: Service, Description, Qty, Amount.
   - Summary: Subtotal, Discount, Total.
2. **Thermal Receipt (Rollback 58mm / 80mm format)**:
   - Monospace formatted receipt printing optimized for standard POS receipt printers.
3. **Profit Statement PDF**:
   - Tabular breakdown with date, invoice, service, item ID, description, qty, selling price, buying price, revenue, cost, profit, plus summary cards.
4. **Inventory List PDF / CSV**:
   - Tabular export of current stock with valuations.
