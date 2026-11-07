# ISURU Service Center - Database Migration Plan (SQLite to MongoDB)

## 1. Overview
The legacy application uses an SQLite database (`billing.db`) containing 10 relational tables. This migration plan details the exact transformation and loading pipeline to convert SQLite relational data into MongoDB collections with Mongoose schemas, maintaining full referential integrity, preserving historical financial records, and storing legacy IDs for auditing and reconciliation.

---

## 2. Table-to-Collection Mapping

| SQLite Table | MongoDB Collection | Mongoose Model | Primary Key Mapping | Foreign Keys Mapping |
|---|---|---|---|---|
| `customers` | `customers` | `Customer` | `legacyId: id` -> `_id: ObjectId` | None |
| `vehicles` | `vehicles` | `Vehicle` | `legacyId: id` -> `_id: ObjectId` | `customer_id` -> `customerId: ObjectId(ref: Customer)` |
| `services` | `services` | `Service` | `legacyId: id` -> `_id: ObjectId` | None |
| `inventory` | `products` | `Product` | `legacyId: id`, `itemId: item_id` -> `_id: ObjectId` | `supplier_code` -> `supplierCode` string |
| `suppliers` | `suppliers` | `Supplier` | `legacyId: id`, `supplierCode: supplier_code` -> `_id: ObjectId` | None |
| `stock_movements`| `stock_movements` | `StockMovement` | `legacyId: id` -> `_id: ObjectId` | `item_id` -> `itemId`, `supplier_code` -> `supplierCode` |
| `supply_invoices`| `supply_invoices` | `SupplyInvoice` | `legacyId: id` -> `_id: ObjectId` | `supplier_code` -> `supplierCode`, `item_id` -> `itemId` |
| `invoices` + `invoice_items` | `invoices` | `Invoice` (with embedded `items`) | `legacyId: id`, `billNo: bill_no` -> `_id: ObjectId` | `customer_id` -> `customerId`, `vehicle_id` -> `vehicleId` |
| `app_settings` | `settings` & `users` | `Setting` & `User` | Key/Value -> Structured Documents | None |

---

## 3. Detailed Schema Designs & Field Conversions

### 3.1 `Customer` Schema
```typescript
{
  _id: ObjectId,
  legacyId: { type: Number, index: true },
  name: { type: String, required: true, trim: true, index: true },
  phone: { type: String, trim: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### 3.2 `Vehicle` Schema
```typescript
{
  _id: ObjectId,
  legacyId: { type: Number, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  vehicleNo: { type: String, required: true, trim: true, index: true },
  vehicleType: { 
    type: String, 
    enum: ['Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others'], 
    default: 'Others',
    index: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### 3.3 `Service` Schema
```typescript
{
  _id: ObjectId,
  legacyId: { type: Number, index: true },
  category: { 
    type: String, 
    enum: ['Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others'], 
    default: 'Others',
    index: true 
  },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0, default: 0 },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}
// Unique compound index: { category: 1, name: 1 }
```

### 3.4 `Product` (Inventory) Schema
```typescript
{
  _id: ObjectId,
  legacyId: { type: Number, index: true },
  itemId: { type: String, required: true, unique: true, uppercase: true, trim: true }, // e.g. ENG-0001
  itemName: { type: String, required: true, trim: true, index: true }, // Category (e.g. Engine Oil)
  brand: { type: String, default: '', trim: true, index: true },
  quantity: { type: Number, required: true, default: 0, min: 0 },
  unitPrice: { type: Number, required: true, min: 0, default: 0 }, // Selling price
  buyingPrice: { type: Number, required: true, min: 0, default: 0 }, // Cost price
  supplierCode: { type: String, default: '', trim: true, index: true },
  paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Cheque'], default: 'Cash' },
  updatedAt: { type: Date, default: Date.now }
}
```

### 3.5 `Supplier` Schema
```typescript
{
  _id: ObjectId,
  legacyId: { type: Number, index: true },
  supplierCode: { type: String, required: true, unique: true, uppercase: true, trim: true }, // SUP-0001
  name: { type: String, required: true, trim: true },
  contact: { type: String, default: '', trim: true },
  cashTotal: { type: Number, default: 0 },
  creditTotal: { type: Number, default: 0 },
  chequeTotal: { type: Number, default: 0 },
  invoice: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}
```

### 3.6 `StockMovement` Schema
```typescript
{
  _id: ObjectId,
  legacyId: { type: Number, index: true },
  itemId: { type: String, required: true, index: true },
  supplierCode: { type: String, default: '', index: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, default: 0 },
  buyingPrice: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Cheque'], default: 'Cash' },
  movedAt: { type: Date, default: Date.now, index: true },
  settledAt: { type: Date, default: null }
}
```

### 3.7 `SupplyInvoice` Schema
```typescript
{
  _id: ObjectId,
  legacyId: { type: Number, index: true },
  invoiceNo: { type: String, required: true, index: true },
  supplierCode: { type: String, required: true, index: true },
  itemId: { type: String, required: true, index: true },
  buyingPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  paymentStatus: { type: String, enum: ['Cash', 'Credit', 'Cheque'], default: 'Cash', index: true },
  chequeNo: { type: String, default: '' },
  branchCode: { type: String, default: '' },
  bankCode: { type: String, default: '' },
  valueDate: { type: Date, default: null },
  settledAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now, index: true }
}
```

### 3.8 `Invoice` Schema (Embedding `invoice_items`)
```typescript
{
  _id: ObjectId,
  legacyId: { type: Number, index: true },
  billNo: { type: String, required: true, unique: true, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
  vehicleNo: { type: String, required: true },
  vehicleType: { type: String, default: 'Others' },
  dateTime: { type: Date, required: true, index: true },
  subtotalAmount: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Cheque', 'Card'], default: 'Cash', index: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'unpaid', 'paid', 'pending'], default: 'Paid', index: true },
  paymentSettledAt: { type: Date, default: null },
  items: [
    {
      service: { type: String, required: true },
      itemId: { type: String, default: '' },
      description: { type: String, default: '' },
      qty: { type: Number, required: true, default: 1 },
      rate: { type: Number, required: true, default: 0 },
      amount: { type: Number, required: true, default: 0 },
      buyingPrice: { type: Number, required: true, default: 0 }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### 3.9 `User` and `Setting` Schemas
```typescript
// User Schema
{
  _id: ObjectId,
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'User'], required: true },
  fullName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}

// Setting Schema
{
  _id: ObjectId,
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 4. Migration Execution Stages

1. **Stage 1: Schema & Environment Verification**:
   - Verify presence of source SQLite file (`billing.db`).
   - Connect to local MongoDB instance (`mongodb://127.0.0.1:27017/isuru_billing`).
   - Create ID reference maps in memory (`Map<oldCustomerId, newCustomerObjectId>`, `Map<oldVehicleId, newVehicleObjectId>`).

2. **Stage 2: Independent Lookups & Entities Migration**:
   - Migrate `app_settings` into `settings` collection and create hashed `User` accounts for `Admin` and `User`.
   - Migrate `services` with `{ category, name, price, description }`.
   - Migrate `suppliers` with `{ supplierCode, name, contact, cashTotal, creditTotal, chequeTotal, invoice }`.
   - Migrate `inventory` into `products` with normalized fields, preserving `item_id`.

3. **Stage 3: Customer & Vehicle Hierarchy Migration**:
   - Migrate `customers`, store mapping from `customers.id` to `Customer._id`.
   - Migrate `vehicles`, lookup `newCustomerId = customerMap.get(row.customer_id)`, store mapping from `vehicles.id` to `Vehicle._id`.

4. **Stage 4: Supply Invoices & Stock Movements**:
   - Migrate `stock_movements`, parsing ISO dates.
   - Migrate `supply_invoices`, parsing dates and cheque information.

5. **Stage 5: Invoices & Embedded Invoice Items**:
   - Query all `invoices` joined or grouped with their respective `invoice_items`.
   - Embed items directly inside the parent `Invoice` document for high-performance atomic retrieval.
   - Recompute and reconcile `subtotalAmount` and `totalAmount`.

6. **Stage 6: Reconciliation & Validation**:
   - Count records in SQLite vs MongoDB:
     - SQLite Customers count == MongoDB Customers count
     - SQLite Vehicles count == MongoDB Vehicles count
     - SQLite Services count == MongoDB Services count
     - SQLite Invoices count == MongoDB Invoices count
     - SQLite Total Revenue == MongoDB Total Revenue sum
     - SQLite Inventory count == MongoDB Products count
   - Output migration audit report.
