import React, { useState, useEffect } from 'react';
import { offlineSyncService, SyncStatus } from '../../services/offlineSyncService';
import { offlineDb, PendingInvoice } from '../../db/offlineDb';
import { Modal } from './Modal';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Download,
  Database,
  CloudUpload,
} from 'lucide-react';

export const SyncStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus>('ONLINE');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pendingInvoices, setPendingInvoices] = useState<PendingInvoice[]>([]);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = offlineSyncService.subscribe((newStatus, count) => {
      setStatus(newStatus);
      setPendingCount(count);
    });
    return () => unsubscribe();
  }, []);

  const loadPendingList = async () => {
    try {
      const list = await offlineDb.pendingInvoices.orderBy('createdAt').reverse().limit(50).toArray();
      setPendingInvoices(list);
      const meta = await offlineDb.syncMetadata.get('lastSyncAttempt');
      if (meta?.value) {
        setLastSyncTime(new Date(meta.value).toLocaleTimeString());
      }
    } catch {
      // Ignore
    }
  };

  const handleOpenModal = () => {
    loadPendingList();
    setIsModalOpen(true);
  };

  const handleTriggerSync = async () => {
    setIsTriggering(true);
    try {
      await offlineSyncService.triggerSync();
      await loadPendingList();
    } finally {
      setIsTriggering(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const json = await offlineSyncService.exportPendingInvoices();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `isuru_pos_offline_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export backup: ' + err);
    }
  };

  const handleWarmCache = async () => {
    setIsTriggering(true);
    try {
      await offlineSyncService.warmLocalCache();
      alert('Local offline cache updated with the latest catalog!');
    } catch (err) {
      alert('Failed to refresh cache: ' + err);
    } finally {
      setIsTriggering(false);
    }
  };

  // Badge configuration based on status
  const badgeConfig = {
    ONLINE: {
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-800',
      dot: 'bg-emerald-500',
      icon: Wifi,
      text: pendingCount > 0 ? `Online (${pendingCount} pending)` : 'Online',
    },
    OFFLINE: {
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-300 text-amber-900',
      dot: 'bg-amber-500 animate-pulse',
      icon: WifiOff,
      text: pendingCount > 0 ? `Offline (${pendingCount} unsynced)` : 'Offline',
    },
    SYNCING: {
      bg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-200 text-blue-800',
      dot: 'bg-blue-500',
      icon: RefreshCw,
      text: 'Syncing...',
    },
    SYNC_ERROR: {
      bg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-300 text-rose-800',
      dot: 'bg-rose-500',
      icon: AlertTriangle,
      text: `Sync Error (${pendingCount})`,
    },
  }[status];

  const IconComponent = badgeConfig.icon;

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold cursor-pointer transition-colors shadow-2xs ${badgeConfig.bg}`}
        title="Click to open Sync Center"
      >
        <span className={`w-2 h-2 rounded-full ${badgeConfig.dot}`} />
        <IconComponent className={`w-3.5 h-3.5 ${status === 'SYNCING' ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">{badgeConfig.text}</span>
      </button>

      {/* Sync Center Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Offline POS & Sync Center"
        subtitle="Monitor persistent transaction queue, connection health, and offline storage"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-slate-800">
          {/* Status Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${badgeConfig.dot}`} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Status: {status}
                </p>
                <p className="text-[11px] text-slate-500">
                  {status === 'ONLINE'
                    ? 'Connected to Neon PostgreSQL cloud database'
                    : status === 'OFFLINE'
                    ? 'Operating offline. Invoices are saved securely in IndexedDB.'
                    : status === 'SYNCING'
                    ? 'Submitting pending transactions to server...'
                    : 'Some pending transactions failed to sync. Review details below.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerSync}
                disabled={isTriggering || status === 'OFFLINE'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTriggering ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Pending Invoices</span>
              <p className="text-lg font-bold text-slate-800">{pendingCount}</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Last Sync Check</span>
              <p className="text-xs font-medium text-slate-700 mt-1">{lastSyncTime || 'Just now'}</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Offline Storage</span>
              <p className="text-xs font-medium text-emerald-600 font-semibold mt-1">IndexedDB Active</p>
            </div>
          </div>

          {/* Pending Invoices Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Transaction Outbox ({pendingInvoices.length})
              </h4>
              <button
                onClick={loadPendingList}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Refresh Queue
              </button>
            </div>

            {pendingInvoices.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                All transactions are fully synchronized with the server!
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                {pendingInvoices.map((inv) => (
                  <div key={inv.id} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{inv.billNo}</span>
                        {inv.finalBillNo && (
                          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1 rounded">
                            Server: {inv.finalBillNo}
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            inv.status === 'SYNCED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'FAILED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {inv.customerName} • {inv.vehicleNo} ({inv.vehicleType})
                      </p>
                      {inv.syncError && (
                        <p className="text-[10px] text-rose-600 font-semibold mt-0.5">
                          Error: {inv.syncError}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-800">
                        Rs. {Number(inv.totalAmount).toFixed(2)}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(inv.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                title="Download JSON copy of all local invoices"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Emergency JSON Backup</span>
              </button>
              <button
                onClick={handleWarmCache}
                disabled={isTriggering || status === 'OFFLINE'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                title="Download latest products and services into IndexedDB"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Warm Local Catalog</span>
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
