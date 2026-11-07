// ==============================================================================
// ISURU SERVICE CENTER POS: OFFLINE SYNCHRONIZATION ENGINE & NETWORK MONITOR
// ==============================================================================
import { offlineDb, PendingInvoice, SyncQueueItem, CachedProduct, CachedService, CachedCustomer } from '../db/offlineDb';
import { api } from './api';

export type SyncStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNC_ERROR';

type StatusListener = (status: SyncStatus, pendingCount: number) => void;

class OfflineSyncService {
  private status: SyncStatus = 'ONLINE';
  private listeners: Set<StatusListener> = new Set();
  private isSyncing = false;
  private checkInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.checkConnectivity());
      window.addEventListener('offline', () => this.setStatus('OFFLINE'));

      // Periodic lightweight connectivity probe every 15 seconds
      this.checkInterval = setInterval(() => {
        this.checkConnectivity();
      }, 15000);

      // Initial check on load
      setTimeout(() => this.checkConnectivity(), 1000);
    }
  }

  public subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener);
    listener(this.status, 0);
    this.notify();
    return () => this.listeners.delete(listener);
  }

  public getStatus(): SyncStatus {
    return this.status;
  }

  private setStatus(newStatus: SyncStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.notify();
    }
  }

  private async notify() {
    const pendingCount = await this.getPendingCount();
    this.listeners.forEach((fn) => fn(this.status, pendingCount));
  }

  public async getPendingCount(): Promise<number> {
    try {
      return await offlineDb.pendingInvoices
        .where('status')
        .equals('PENDING')
        .count();
    } catch {
      return 0;
    }
  }

  public async getFailedCount(): Promise<number> {
    try {
      return await offlineDb.pendingInvoices
        .where('status')
        .equals('FAILED')
        .count();
    } catch {
      return 0;
    }
  }

  // 1. Connectivity Probe: distinguishes online, offline, and server errors
  public async checkConnectivity(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.setStatus('OFFLINE');
      return false;
    }

    try {
      const res = await api.get('/health', { timeout: 4000 });
      if (res.data?.status === 'ok') {
        const prevStatus = this.status;
        const failedCount = await this.getFailedCount();
        this.setStatus(failedCount > 0 ? 'SYNC_ERROR' : 'ONLINE');

        // Automatically trigger sync if returning online from an offline state
        if (prevStatus === 'OFFLINE') {
          this.triggerSync();
          this.warmLocalCache();
        }
        return true;
      }
      this.setStatus('OFFLINE');
      return false;
    } catch {
      this.setStatus('OFFLINE');
      return false;
    }
  }

  // 2. Cache Warming: Seed IndexedDB with catalog items when online
  public async warmLocalCache(): Promise<void> {
    if (this.status === 'OFFLINE') return;

    try {
      // Warm Products
      const prodRes = await api.get('/inventory?limit=2000');
      if (Array.isArray(prodRes.data?.items)) {
        const products: CachedProduct[] = prodRes.data.items.map((p: any) => ({
          id: p.id,
          itemId: p.itemId,
          itemName: p.itemName,
          brand: p.brand || '',
          quantity: p.quantity,
          unitPrice: Number(p.unitPrice),
          buyingPrice: Number(p.buyingPrice),
          supplierCode: p.supplierCode || '',
          updatedAt: p.updatedAt,
        }));
        await offlineDb.cachedProducts.bulkPut(products);
      }

      // Warm Services
      const svcRes = await api.get('/services');
      if (Array.isArray(svcRes.data?.services)) {
        const services: CachedService[] = svcRes.data.services.map((s: any) => ({
          id: s.id,
          category: s.category,
          name: s.name,
          price: Number(s.price),
          description: s.description || '',
        }));
        await offlineDb.cachedServices.bulkPut(services);
      }

      // Warm Customers
      try {
        const custRes = await api.get('/customers?limit=1000');
        if (Array.isArray(custRes.data?.customers)) {
          const customers: CachedCustomer[] = custRes.data.customers.map((c: any) => ({
            id: c.id,
            name: c.name,
            phone: c.phone || '',
            nic: c.idNo || '',
            bankDetails: c.bankDetails || '',
            updatedAt: c.updatedAt,
          }));
          await offlineDb.cachedCustomers.bulkPut(customers);
        }
      } catch {
        // Non-blocking
      }

      await offlineDb.syncMetadata.put({
        key: 'lastCacheWarm',
        value: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[OfflineSync] Cache warming error:', err);
    }
  }

  // 3. Collision-Safe Provisional Bill Number Generator (OFF-YYYYMMDD-XXXX)
  private async generateProvisionalBillNo(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `OFF-${dateStr}`;

    const countToday = await offlineDb.pendingInvoices
      .where('billNo')
      .startsWith(prefix)
      .count();

    const seq = String(countToday + 1).padStart(4, '0');
    return `${prefix}-${seq}`;
  }

  // 4. Save Invoice Locally (Atomic Local Transaction)
  public async createInvoice(invoiceData: any): Promise<{
    invoice: PendingInvoice;
    isOffline: boolean;
    syncedImmediately: boolean;
  }> {
    const isOnline = await this.checkConnectivity();
    const clientTxId = crypto.randomUUID();
    const provisionalBillNo = await this.generateProvisionalBillNo();
    const nowIso = new Date().toISOString();

    const pendingInvoice: PendingInvoice = {
      id: clientTxId,
      clientTxId,
      billNo: provisionalBillNo,
      finalBillNo: null,
      customerId: invoiceData.customerId || null,
      customerName: invoiceData.customerName,
      customerPhone: invoiceData.customerPhone || '',
      vehicleId: invoiceData.vehicleId || null,
      vehicleNo: invoiceData.vehicleNo,
      vehicleType: invoiceData.vehicleType || 'Others',
      dateTime: invoiceData.dateTime || nowIso,
      subtotalAmount: Number(invoiceData.subtotalAmount) || 0,
      discountAmount: Number(invoiceData.discountAmount) || 0,
      totalAmount: Number(invoiceData.totalAmount) || 0,
      paymentMethod: invoiceData.paymentMethod || 'Cash',
      paymentStatus: invoiceData.paymentStatus || 'Paid',
      items: invoiceData.items || [],
      status: 'PENDING',
      isProvisional: true,
      createdAt: nowIso,
    };

    // Atomic local transaction: update local inventory and save pending invoice
    await offlineDb.transaction('rw', [offlineDb.cachedProducts, offlineDb.pendingInvoices, offlineDb.syncQueue], async () => {
      // Local stock decrement for items sold
      for (const item of pendingInvoice.items) {
        if (item.itemId) {
          const cached = await offlineDb.cachedProducts.where('itemId').equals(item.itemId.toUpperCase()).first();
          if (cached) {
            const newQty = Math.max(0, cached.quantity - item.qty);
            await offlineDb.cachedProducts.update(cached.id, { quantity: newQty });
          }
        }
      }

      await offlineDb.pendingInvoices.put(pendingInvoice);
      await offlineDb.syncQueue.put({
        id: clientTxId,
        clientOpId: clientTxId,
        operationType: 'CREATE_INVOICE',
        payload: {
          ...invoiceData,
          clientTxId,
          provisionalBillNo,
        },
        createdAt: nowIso,
        retryCount: 0,
        status: 'PENDING',
      });
    });

    this.notify();

    // If online, attempt instant background sync
    if (isOnline) {
      try {
        const syncSuccess = await this.syncSingleInvoice(pendingInvoice);
        if (syncSuccess) {
          const synced = await offlineDb.pendingInvoices.get(pendingInvoice.id);
          return { invoice: synced || pendingInvoice, isOffline: false, syncedImmediately: true };
        }
      } catch {
        // Fall back to queued offline
      }
    }

    return { invoice: pendingInvoice, isOffline: true, syncedImmediately: false };
  }

  // 5. Sync a single invoice idempotently
  private async syncSingleInvoice(inv: PendingInvoice): Promise<boolean> {
    try {
      const payload = {
        clientTxId: inv.clientTxId,
        provisionalBillNo: inv.billNo,
        customerId: inv.customerId,
        customerName: inv.customerName,
        customerPhone: inv.customerPhone,
        vehicleId: inv.vehicleId,
        vehicleNo: inv.vehicleNo,
        vehicleType: inv.vehicleType,
        dateTime: inv.dateTime,
        subtotalAmount: inv.subtotalAmount,
        discountAmount: inv.discountAmount,
        totalAmount: inv.totalAmount,
        paymentMethod: inv.paymentMethod,
        paymentStatus: inv.paymentStatus,
        items: inv.items,
      };

      const res = await api.post('/sync/invoices', payload);
      if (res.data?.success && res.data?.invoice) {
        const serverInvoice = res.data.invoice;
        await offlineDb.pendingInvoices.update(inv.id, {
          status: 'SYNCED',
          finalBillNo: serverInvoice.billNo,
          isProvisional: false,
          syncedAt: new Date().toISOString(),
          syncError: null,
        });

        await offlineDb.syncQueue.update(inv.clientTxId, {
          status: 'RESOLVED',
        });

        this.notify();
        return true;
      }
      return false;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || 'Sync failed';
      await offlineDb.pendingInvoices.update(inv.id, {
        status: 'FAILED',
        syncError: errMsg,
      });
      await offlineDb.syncQueue.update(inv.clientTxId, {
        status: 'FAILED',
        lastError: errMsg,
      });
      this.setStatus('SYNC_ERROR');
      return false;
    }
  }

  // 6. Trigger Full Outbox Synchronization
  public async triggerSync(): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing) return { synced: 0, failed: 0 };
    this.isSyncing = true;
    this.setStatus('SYNCING');

    let synced = 0;
    let failed = 0;

    try {
      const pendingItems = await offlineDb.pendingInvoices
        .where('status')
        .anyOf(['PENDING', 'FAILED'])
        .sortBy('createdAt');

      for (const inv of pendingItems) {
        const success = await this.syncSingleInvoice(inv);
        if (success) {
          synced++;
        } else {
          failed++;
        }
      }

      await offlineDb.syncMetadata.put({
        key: 'lastSyncAttempt',
        value: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (failed > 0) {
        this.setStatus('SYNC_ERROR');
      } else {
        this.setStatus('ONLINE');
      }
    } catch {
      this.setStatus('SYNC_ERROR');
    } finally {
      this.isSyncing = false;
      this.notify();
    }

    return { synced, failed };
  }

  // 7. Emergency Export for Backup Recovery
  public async exportPendingInvoices(): Promise<string> {
    const allPending = await offlineDb.pendingInvoices.toArray();
    return JSON.stringify(allPending, null, 2);
  }
}

export const offlineSyncService = new OfflineSyncService();
