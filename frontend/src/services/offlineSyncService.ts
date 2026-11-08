// ==============================================================================
// ISURU SERVICE CENTER POS: OFFLINE SYNCHRONIZATION ENGINE & NETWORK MONITOR
// ==============================================================================
import {
  offlineDb,
  PendingInvoice,
  SyncQueueItem,
  CachedProduct,
  CachedService,
  CachedCustomer,
  LocalStockMovement,
} from '../db/offlineDb';
import { api } from './api';

export type SyncStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNC_ERROR' | 'CONFLICT';

type StatusListener = (status: SyncStatus, pendingCount: number) => void;

// ------------------------------------------------------------------------------
// Web Crypto Helpers: SHA-256 Checksum, PBKDF2 Key Derivation & AES-GCM
// ------------------------------------------------------------------------------
async function calculateSha256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function deriveAesKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

class OfflineSyncService {
  private status: SyncStatus = 'ONLINE';
  private listeners: Set<StatusListener> = new Set();
  private isSyncing = false;
  private checkInterval: any = null;
  private retryDelayMs = 2000;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkRecovery());
      window.addEventListener('offline', () => this.setStatus('OFFLINE'));

      // Periodic connectivity & sync probe every 15 seconds
      this.checkInterval = setInterval(() => {
        this.checkConnectivity();
      }, 15000);

      // Initial check on startup
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

  // 1. Connectivity Probe: Distinguishes online, offline, and server errors
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

        if (prevStatus === 'OFFLINE') {
          this.handleNetworkRecovery();
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

  private async handleNetworkRecovery() {
    await this.checkConnectivity();
    await this.warmLocalCache();
    await this.triggerSync();
  }

  // 2. Cache Warming: Seed IndexedDB with catalog items when online
  public async warmLocalCache(): Promise<void> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

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

    // Atomic local transaction: update local inventory and save pending invoice & outbox queue
    await offlineDb.transaction(
      'rw',
      [
        offlineDb.cachedProducts,
        offlineDb.pendingInvoices,
        offlineDb.syncQueue,
        offlineDb.localStockMovements,
      ],
      async () => {
        // Local stock decrement and audit movement for items sold
        for (const item of pendingInvoice.items) {
          if (item.itemId) {
            const cached = await offlineDb.cachedProducts
              .where('itemId')
              .equals(item.itemId.toUpperCase())
              .first();
            if (cached) {
              const newQty = Math.max(0, cached.quantity - item.qty);
              await offlineDb.cachedProducts.update(cached.id, { quantity: newQty });

              // Record local stock movement audit
              await offlineDb.localStockMovements.put({
                id: crypto.randomUUID(),
                itemId: item.itemId.toUpperCase(),
                quantity: -item.qty,
                unitPrice: item.rate,
                buyingPrice: cached.buyingPrice || 0,
                movedAt: nowIso,
                invoiceId: clientTxId,
                status: 'PENDING',
              });
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
      }
    );

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

        // Mark local stock movement as synced
        const movements = await offlineDb.localStockMovements
          .where('invoiceId')
          .equals(inv.clientTxId)
          .toArray();
        for (const mov of movements) {
          await offlineDb.localStockMovements.update(mov.id, { status: 'SYNCED' });
        }

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

  // 6. Trigger Full Outbox Synchronization (Multi-Tab Coordinated)
  public async triggerSync(): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing) return { synced: 0, failed: 0 };

    // Multi-tab coordination using Web Locks API if supported
    if (typeof navigator !== 'undefined' && 'locks' in navigator) {
      return (navigator as any).locks.request(
        'isuru_pos_sync_worker_lock',
        { ifAvailable: true },
        async (lock: any) => {
          if (!lock) {
            console.log('[OfflineSync] Another browser tab is executing sync. Skipping.');
            return { synced: 0, failed: 0 };
          }
          return this.executeSyncBatch();
        }
      );
    }

    return this.executeSyncBatch();
  }

  private async executeSyncBatch(): Promise<{ synced: number; failed: number }> {
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
          this.retryDelayMs = 2000; // Reset backoff on success
        } else {
          failed++;
          // Exponential backoff up to 30 seconds
          this.retryDelayMs = Math.min(30000, Math.round(this.retryDelayMs * 1.5));
          break; // Stop batch on first network/server failure to avoid hammering
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

  // 7. Secure Recovery Backup Export (With optional AES-GCM Encryption)
  public async exportRecoveryBackup(passphrase?: string): Promise<string> {
    const pendingInvoices = await offlineDb.pendingInvoices.toArray();
    const syncQueue = await offlineDb.syncQueue.toArray();
    const movements = await offlineDb.localStockMovements.toArray();
    const metadata = await offlineDb.syncMetadata.toArray();

    const payloadObj = {
      pendingInvoices,
      syncQueue,
      movements,
      metadata,
    };
    const payloadStr = JSON.stringify(payloadObj);
    const checksum = await calculateSha256(payloadStr);

    let finalPayload = payloadStr;
    let isEncrypted = false;
    let saltHex: string | undefined;
    let ivHex: string | undefined;

    if (passphrase && passphrase.trim()) {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveAesKey(passphrase.trim(), salt);
      const encoded = new TextEncoder().encode(payloadStr);
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

      finalPayload = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
      isEncrypted = true;
      saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('');
      ivHex = Array.from(iv).map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    const backupContainer = {
      app: 'ISURU_SERVICE_POS_BACKUP',
      schemaVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      checksum,
      isEncrypted,
      salt: saltHex,
      iv: ivHex,
      data: finalPayload,
    };

    return JSON.stringify(backupContainer, null, 2);
  }

  // 8. Secure Recovery Backup Restore (With Preview and Duplicate Protection)
  public async restoreRecoveryBackup(
    backupJson: string,
    passphrase?: string,
    previewOnly = false
  ): Promise<{
    success: boolean;
    error?: string;
    invoicesCount: number;
    queueCount: number;
    duplicatesCount: number;
  }> {
    try {
      const container = JSON.parse(backupJson);
      if (container.app !== 'ISURU_SERVICE_POS_BACKUP') {
        return { success: false, error: 'Invalid backup file format.', invoicesCount: 0, queueCount: 0, duplicatesCount: 0 };
      }

      let payloadStr = container.data;
      if (container.isEncrypted) {
        if (!passphrase) {
          return { success: false, error: 'Passphrase is required to decrypt this backup.', invoicesCount: 0, queueCount: 0, duplicatesCount: 0 };
        }
        try {
          const salt = new Uint8Array(container.salt.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
          const iv = new Uint8Array(container.iv.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
          const key = await deriveAesKey(passphrase.trim(), salt);
          const encryptedBytes = Uint8Array.from(atob(payloadStr), (c) => c.charCodeAt(0));
          const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedBytes);
          payloadStr = new TextDecoder().decode(decrypted);
        } catch {
          return { success: false, error: 'Decryption failed. Incorrect passphrase or corrupted data.', invoicesCount: 0, queueCount: 0, duplicatesCount: 0 };
        }
      }

      // Verify SHA256 integrity checksum
      const actualChecksum = await calculateSha256(payloadStr);
      if (actualChecksum !== container.checksum) {
        return { success: false, error: 'Checksum verification failed! Backup file is corrupted or tampered.', invoicesCount: 0, queueCount: 0, duplicatesCount: 0 };
      }

      const payload = JSON.parse(payloadStr);
      const incomingInvoices: PendingInvoice[] = payload.pendingInvoices || [];
      const incomingQueue: SyncQueueItem[] = payload.payload?.syncQueue || payload.syncQueue || [];
      const incomingMovements: LocalStockMovement[] = payload.movements || [];

      // Check duplicates against existing database
      const existingInvoices = await offlineDb.pendingInvoices.toArray();
      const existingIds = new Set(existingInvoices.map((inv) => inv.id));

      const newInvoices = incomingInvoices.filter((inv) => !existingIds.has(inv.id));
      const duplicatesCount = incomingInvoices.length - newInvoices.length;

      if (previewOnly) {
        return {
          success: true,
          invoicesCount: newInvoices.length,
          queueCount: incomingQueue.length,
          duplicatesCount,
        };
      }

      // Restore without overwriting existing newer records
      await offlineDb.transaction('rw', [offlineDb.pendingInvoices, offlineDb.syncQueue, offlineDb.localStockMovements], async () => {
        if (newInvoices.length > 0) {
          await offlineDb.pendingInvoices.bulkPut(newInvoices);
        }
        for (const item of incomingQueue) {
          const exists = await offlineDb.syncQueue.get(item.id);
          if (!exists) {
            await offlineDb.syncQueue.put(item);
          }
        }
        if (incomingMovements.length > 0) {
          await offlineDb.localStockMovements.bulkPut(incomingMovements);
        }
      });

      this.notify();
      // Resume background sync if online
      this.checkConnectivity();

      return {
        success: true,
        invoicesCount: newInvoices.length,
        queueCount: incomingQueue.length,
        duplicatesCount,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Restoration failed.', invoicesCount: 0, queueCount: 0, duplicatesCount: 0 };
    }
  }
}

export const offlineSyncService = new OfflineSyncService();
