# ISURU Service Center Billing System - Existing Feature Inventory

This document provides a comprehensive inventory of all features discovered across the Windows Forms desktop application (`ServiceStationBillingApp`) and the ASP.NET Core MVC web application (`ServiceStationBillingWeb`).

---

## 1. Authentication & Session Management
- **Login Screen**:
  - Username & password authentication.
  - Role assignment: Admin vs User (Staff).
  - Quick-fill helper buttons in desktop: "Admin" (`Isuru@6800`) and "Other User" (`User@123`).
  - Session persistence: Cookie authentication with role claim in Web; in-memory authenticated role token in Desktop.
  - Access Denied screen / unauthorized redirection for protected views.
  - Logout action that destroys the active session.

## 2. Dashboard & Analytics
- **Live Counters**:
  - Total Customers count.
  - Total Registered Vehicles count.
  - Total Invoices issued.
  - Total Inventory item count.
  - Total Lifetime Sales Revenue.
- **Recent Invoices**:
  - Latest 8 invoices with Bill No, Customer name, Date, Total Amount, Payment Status.
- **Quick Links / Direct Navigation**:
  - Direct routes to New Bill, Customers, Services, Inventory, Suppliers, Supply Invoices, Invoices, and Profit Statement.

## 3. POS Billing & Invoicing Engine
- **Customer Auto-Lookup & Creation**:
  - Live search / autocomplete by name or contact number.
  - Automatic creation of customer record if not found.
  - Phone number validation (10 digits).
- **Vehicle Auto-Lookup & Registration**:
  - Automatic registration of vehicle under selected customer.
  - Category classification: Car, Bike, Van, Bus, Lorry, Others.
- **Dynamic Services & Inventory Integration**:
  - Service selection dropdown filtered by vehicle category.
  - Inventory-rated services ("Engine Oil Change", "Filters Replacement", "Custom Item") automatically resolve Item ID, Brand, and Unit Price from inventory.
  - Manual override for descriptions and rates.
- **Financial Calculations**:
  - Line amount calculation: `Qty * Rate`.
  - Live subtotal accumulation.
  - Discount entry with bounds checking (`0 <= Discount <= Subtotal`).
  - Grand total calculation.
  - Payment method selection: Cash, Cheque, Credit, Card.
  - Auto payment status assignment:
    - Cash / Card: `Paid`
    - Credit: `Pending` / `unpaid`
    - Cheque: `pending`
- **Stock Deduction**:
  - Automatic deduction of stock for inventory line items upon bill saving.
  - Prevention of negative stock (clamped at 0).
  - Snapshotting of `buying_price` into invoice line item at sale time.
- **Keyboard Shortcuts (Desktop Productivity)**:
  - `Ctrl + S`: Save Bill.
  - `F2`: Add new line item.
  - `Ctrl + H`: Open Bill History.
  - `Ctrl + A`: Select all rows in item grid.
  - `Escape`: Delete selected row or clear bill form.

## 4. Invoice History & Printing
- **Invoice Listing**:
  - Date range filtering (From Date to To Date).
  - Search by Bill No or Customer Name.
  - Payment method filter (All, Cash, Cheque, Credit).
  - Summary totals badge: Total Cash, Total Cheque, Total Credit.
- **Creditor Management & Bill Settlement**:
  - "Creditors Only" toggle to filter unpaid credit bills.
  - Batch / Single "Mark Settled" action updating `payment_status = 'paid'` and recording `payment_settled_at`.
- **Bill History & Vehicle Service Drill-Down**:
  - Customer name search with suggestions.
  - Side-by-side grids: Customer list, Registered Vehicles list, Invoices issued for that customer and vehicle.
  - Double-click invoice to inspect, preview, and reprint.
- **Printing Formats**:
  - **A4 Professional Invoice Layout**: Logo, company info, customer/vehicle metadata, line items table, subtotal, discount, total, footer.
  - **Thermal Rollback Receipt (58mm / 80mm)**: Compact monospace receipt layout for thermal POS hardware.
  - **HTML Export**: Standalone formatted HTML invoice with embedded base64 logo.
  - **PDF Export**: Print-to-PDF generation.

## 5. Inventory & Stock Management
- **Product Item Structure**:
  - Item ID (Unique, e.g. `ENG-0001`, `FIL-0002`).
  - Item Name / Category (e.g. Engine Oil, Gear Oil, Filters, Brake Fluid, Coolant, Accessories, Tires).
  - Brand (e.g. Castrol, Mobil, Shell, Toyota, OEM).
  - Quantity (in stock).
  - Unit Price (selling price to customer).
  - Buying Price (purchase cost from supplier).
  - Supplier Code (associated supplier).
  - Payment Method (Cash, Credit, Cheque).
  - Updated At timestamp.
- **Smart Stock Increment / Add**:
  - If Item ID exists or matching Category + Brand + Price exists, quantity is updated.
  - Otherwise, a new sequential Item ID is auto-generated (`CAT-0001`).
  - Stock movement ledger entry automatically created.
- **Item CRUD & In-Grid Editing**:
  - Admin update of brand, quantity, selling price, buying price, supplier, payment method.
  - Admin deletion of stock items.
  - User role enforcement (Read-only for staff).
- **Batch CSV Import**:
  - Prompts for Category & Brand.
  - Parses CSV rows (`ItemId`, `Price`) and bulk imports.
- **PDF Export**:
  - Formatted tabular inventory listing with total valuation.

## 6. Supplier Management & Ledger
- **Supplier Profile**:
  - Supplier Code (e.g. `SUP-0001`).
  - Supplier Name.
  - Contact Number.
  - Invoice note/memo field.
- **Financial Balances**:
  - `Cash Total`: Total stock purchased via cash.
  - `Credit Total`: Outstanding payables on credit.
  - `Cheque Total`: Issued cheque liabilities.
  - Automatic balance recalculation based on inventory / supply invoice movements.
- **Supplier Payment Details & Settlement**:
  - Filterable by payment type: Cash, Credit, Cheque.
  - Detailed list of movements per supplier.
  - Action to mark credit / cheque transactions as settled (`settled_at`).

## 7. Supply Invoices (Purchases)
- **Supply Invoice Registration**:
  - Invoice No.
  - Supplier Code (auto-creates supplier if not present).
  - Item ID (must exist in inventory).
  - Buying Price.
  - Quantity.
  - Payment Status (Cash, Credit, Cheque).
  - Cheque Information: Cheque No, Branch Code, Bank Code, Value Date.
- **Inventory & Supplier Ledger Impact**:
  - Automatically increases inventory quantity and updates latest buying price.
  - Adds audit row to `stock_movements`.
  - Updates supplier balances.
- **Settlement Workflow**:
  - "Mark Settled" for unsettled cheque or credit supply invoices.

## 8. Service Rates & Vehicle Categories
- **Service Catalog**:
  - Categorized by vehicle type: Car, Bike, Van, Bus, Lorry, Others.
  - Standard services: Engine Oil Change, Full Service / Body Wash, Interior Cleaning, Vacuum, Tune-up, Filters Replacement, Labor Charges, Custom Item.
  - Unit Price for fixed-rate labor/service.
  - Description.
  - Unique constraint on `(Category, Name)`.
- **Management Operations**:
  - Admin Add, Edit, Delete services.
  - Filterable by vehicle category.

## 9. Profit & Loss Management
- **Date Range Reporting**:
  - Flexible From/To date filter.
- **Detailed Itemized Statement**:
  - Date, Invoice No, Service/Category, Item ID, Description, Qty, Selling Price, Buying Price, Revenue, Cost, Profit.
  - Positive profit in green, loss in red.
- **Summary Metrics**:
  - Service Revenue (Labour charges without inventory item ID).
  - Parts / Inventory Revenue (Revenue from products).
  - Total Sales Revenue (`Service Revenue + Parts Revenue`).
  - Cost of Goods Sold (COGS: `Σ Qty * Buying Price`).
  - Gross Profit (`Total Sales Revenue - COGS`).
  - Profit Margin % (`Gross Profit / Total Sales Revenue * 100`).
  - Total Purchases (Supply Invoices total in period).
  - Net Profit After Purchases (`Gross Profit - Total Purchases`).
- **Export & Printing**:
  - Formatted PDF export using QuestPDF in Desktop / Print view in Web.

## 10. Customer Management
- **Customer Directory**:
  - Name, Phone, Vehicle count.
  - Search by Name or Phone.
  - Admin Add, Edit, Delete.
- **Vehicle Linkage**:
  - Association of multiple vehicles to a customer.

## 11. Business Settings & Configuration
- **Company Branding**:
  - Business Name ("Isuru Service Center").
  - Address ("Your Address Here").
  - Contact ("+94-000-000000").
  - Logo file upload and preview (`logo.png`).
- **User Credential Management**:
  - Admin Username & Password update.
  - User (Staff) Username & Password update.
  - Stored in settings repository.

## 12. Maintenance & CLI Diagnostics
- CLI flags in legacy app:
  - `--purge-suppliers`: Clears supplier balances and movements.
  - `--purge-all`: Clears all transactional data in correct FK order.
  - `--db-counts`: Outputs row counts for all tables.
