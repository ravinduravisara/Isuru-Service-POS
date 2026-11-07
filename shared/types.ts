import { UserRole, VehicleType, PaymentMethod, PaymentStatus } from './constants.js';

export interface UserDTO {
  id: string;
  username: string;
  role: UserRole;
  fullName?: string;
}

export interface CustomerDTO {
  id: string;
  name: string;
  phone: string;
  vehiclesCount?: number;
  createdAt: string;
}

export interface VehicleDTO {
  id: string;
  customerId: string;
  vehicleNo: string;
  vehicleType: VehicleType;
  createdAt: string;
}

export interface ServiceDTO {
  id: string;
  category: VehicleType;
  name: string;
  price: number;
  description: string;
}

export interface ProductDTO {
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
}

export interface InvoiceItemDTO {
  service: string;
  itemId?: string;
  description?: string;
  qty: number;
  rate: number;
  amount: number;
  buyingPrice: number;
}

export interface InvoiceDTO {
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
  items: InvoiceItemDTO[];
  createdAt: string;
}

export interface SupplierDTO {
  id: string;
  supplierCode: string;
  name: string;
  contact: string;
  cashTotal: number;
  creditTotal: number;
  chequeTotal: number;
  invoice: string;
}

export interface SupplyInvoiceDTO {
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
  createdAt: string;
}
