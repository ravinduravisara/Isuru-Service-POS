// ==============================================================================
// ISURU SERVICE CENTER POS: OFFLINE INDEXEDDB DATABASE (DEXIE)
// ==============================================================================
import Dexie, { Table } from 'dexie';

export interface CachedProduct {
  id: string;
  itemId: string;
  itemName: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  buyingPrice: number;
  supplierCode?: string;
  updatedAt?: string;
}

export interface CachedService {
  id: string;
  category: string;
  name: string;
  price: number;
  description?: string;
}

export interface CachedCustomer {
  id: string;
  name: string;
  phone: string;
  nic?: string;
  bankDetails?: string;
  updatedAt?: string;
}

export interface CachedVehicle {
  id: string;
  customerId: string;
  vehicleNo: string;
  vehicleType: string;
  updatedAt?: string;
}

export interface OfflineInvoiceItem {
  service: string;
  itemId?: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
  buyingPrice?: number;
}

export interface PendingInvoice {
  id: string; // Stable Client Transaction UUID
  clientTxId: string;
  billNo: string; // Provisional (e.g. "OFF-20261108-0001")
  finalBillNo?: string | null;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  vehicleId?: string | null;
  vehicleNo: string;
  vehicleType: string;
  dateTime: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  items: OfflineInvoiceItem[];
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'CONFLICT';
  isProvisional: boolean;
  createdAt: string;
  syncedAt?: string | null;
  syncError?: string | null;
}

export interface SyncQueueItem {
  id: string; // clientOpId
  clientOpId: string;
  operationType: 'CREATE_INVOICE' | 'STOCK_MOVEMENT';
  payload: any;
  createdAt: string;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'RESOLVED';
  lastError?: string | null;
}

export interface SyncMetadata {
  key: string;
  value: any;
  updatedAt: string;
}

export class IsuruPosDatabase extends Dexie {
  cachedProducts!: Table<CachedProduct, string>;
  cachedServices!: Table<CachedService, string>;
  cachedCustomers!: Table<CachedCustomer, string>;
  cachedVehicles!: Table<CachedVehicle, string>;
  pendingInvoices!: Table<PendingInvoice, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  syncMetadata!: Table<SyncMetadata, string>;

  constructor() {
    super('isuru_pos_offline_db');

    this.version(1).stores({
      cachedProducts: 'id, &itemId, itemName, brand',
      cachedServices: 'id, [category+name], category, name',
      cachedCustomers: 'id, name, phone, nic',
      cachedVehicles: 'id, customerId, vehicleNo, vehicleType',
      pendingInvoices: 'id, &clientTxId, billNo, status, createdAt',
      syncQueue: 'id, &clientOpId, operationType, status, createdAt',
      syncMetadata: 'key',
    });
  }
}

export const offlineDb = new IsuruPosDatabase();
