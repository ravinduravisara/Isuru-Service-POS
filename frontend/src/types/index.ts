export type UserRole = 'Admin' | 'User';
export type VehicleType = string;
export type PaymentMethod = 'Cash' | 'Credit' | 'Cheque' | 'Card';
export type PaymentStatus = 'Paid' | 'Pending' | 'unpaid' | 'paid' | 'pending';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  fullName?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  nic?: string;
  bankDetails?: string;
  vehiclesCount?: number;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  vehicleNo: string;
  vehicleType: VehicleType;
  createdAt: string;
}

export interface Service {
  id: string;
  category: VehicleType;
  name: string;
  price: number;
  description: string;
}

export interface Product {
  id: string;
  itemId: string;
  itemName: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  buyingPrice: number;
  supplierCode?: string;
  paymentMethod: 'Cash' | 'Credit' | 'Cheque';
  updatedAt: string;
  sellingValue?: number;
  costValue?: number;
}

export interface InvoiceItem {
  service: string;
  itemId?: string;
  description?: string;
  qty: number;
  rate: number;
  amount: number;
  buyingPrice?: number;
}

export interface Invoice {
  id: string;
  billNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  vehicleNo: string;
  vehicleType: string;
  dateTime: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentSettledAt?: string | null;
  items: InvoiceItem[];
}

export interface Supplier {
  id: string;
  supplierCode: string;
  name: string;
  contact: string;
  cashTotal: number;
  creditTotal: number;
  chequeTotal: number;
  invoice: string;
}

export interface SupplyInvoice {
  id: string;
  invoiceNo: string;
  supplierCode: string;
  itemId: string;
  buyingPrice: number;
  quantity: number;
  total: number;
  paymentStatus: 'Cash' | 'Credit' | 'Cheque';
  chequeNo?: string;
  branchCode?: string;
  bankCode?: string;
  valueDate?: string | null;
  settledAt?: string | null;
  isSettled?: boolean;
  createdAt: string;
}

export interface ProfitLine {
  date: string;
  invoiceNo: string;
  customerName: string;
  vehicleNo: string;
  service: string;
  itemId: string;
  description: string;
  qty: number;
  sellingPrice: number;
  buyingPrice: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface ProfitStatement {
  from: string;
  to: string;
  serviceRevenue: number;
  partsRevenue: number;
  totalSalesRevenue: number;
  cogs: number;
  grossProfit: number;
  profitMargin: number;
  totalPurchases: number;
  netProfitAfterPurchases: number;
  linesCount: number;
  lines: ProfitLine[];
}

export interface DashboardMetrics {
  customers: number;
  vehicles: number;
  invoices: number;
  inventoryItems: number;
  revenue: number;
  suppliers: number;
  pendingCreditAmount: number;
  pendingCreditCount: number;
  lowStockItems: number;
}
