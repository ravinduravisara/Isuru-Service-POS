import React, { useState, useEffect, useRef } from 'react';
import { offlineSyncService, SyncStatus } from '../../services/offlineSyncService';
import { offlineDb, PendingInvoice } from '../../db/offlineDb';
import { getStorageStatus, StorageStatus } from '../../serviceWorkerRegistration';
import { Modal } from './Modal';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Database,
  HardDrive,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export const SyncStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus>('ONLINE');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pendingInvoices, setPendingInvoices] = useState<PendingInvoice[]>([]);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);

  // Restore Modal State
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState<boolean>(false);
  const [restoreJson, setRestoreJson] = useState<string>('');
  const [restorePassphrase, setRestorePassphrase] = useState<string>('');
  const [restorePreview, setRestorePreview] = useState<{
    invoicesCount: number;
    duplicatesCount: number;
    queueCount: number;
  } | null>(null);
  const [restoreError, setRestoreError] = useState<string>('');
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const st = await getStorageStatus();
      setStorageStatus(st);
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
      const passphrase = window.prompt(
        'Optional: Enter a passphrase to encrypt this emergency backup with AES-GCM (Leave blank for standard unencrypted export):'
      );
      if (passphrase === null) return; // User cancelled

      const json = await offlineSyncService.exportRecoveryBackup(passphrase || undefined);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `isuru_pos_recovery_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export backup: ' + err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      setRestoreJson(text);
      setRestoreError('');
      // Check if encrypted
      try {
        const parsed = JSON.parse(text);
        if (parsed.isEncrypted) {
          setIsRestoreModalOpen(true);
          setRestorePreview(null);
        } else {
          // Preview directly
          const preview = await offlineSyncService.restoreRecoveryBackup(text, undefined, true);
          if (preview.success) {
            setRestorePreview(preview);
            setIsRestoreModalOpen(true);
          } else {
            setRestoreError(preview.error || 'Invalid backup structure');
            setIsRestoreModalOpen(true);
          }
        }
      } catch (err: any) {
        alert('Corrupted JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handlePreviewEncrypted = async () => {
    setRestoreError('');
    const preview = await offlineSyncService.restoreRecoveryBackup(restoreJson, restorePassphrase, true);
    if (preview.success) {
      setRestorePreview(preview);
    } else {
      setRestoreError(preview.error || 'Decryption failed.');
    }
  };

  const handleConfirmRestore = async () => {
    setIsRestoring(true);
    setRestoreError('');
    try {
      const res = await offlineSyncService.restoreRecoveryBackup(restoreJson, restorePassphrase, false);
      if (res.success) {
        alert(`Successfully restored ${res.invoicesCount} transactions (${res.duplicatesCount} duplicates safely skipped).`);
        setIsRestoreModalOpen(false);
        setRestoreJson('');
        setRestorePassphrase('');
        setRestorePreview(null);
        loadPendingList();
      } else {
        setRestoreError(res.error || 'Restore failed.');
      }
    } finally {
      setIsRestoring(false);
    }
  };

  const handleWarmCache = async () => {
    setIsTriggering(true);
    try {
      await offlineSyncService.warmLocalCache();
      alert('Local offline catalog updated with latest products and services!');
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
    CONFLICT: {
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-300 text-purple-800',
      dot: 'bg-purple-500',
      icon: AlertTriangle,
      text: 'Sync Conflict',
    },
  }[status];

  const IconComponent = badgeConfig.icon;

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold cursor-pointer transition-colors shadow-2xs ${badgeConfig.bg}`}
        title="Click to open Offline & Sync Center"
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
        subtitle="Durable transaction outbox, persistent IndexedDB, and automatic cloud synchronization"
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
                    ? 'Connected to Neon PostgreSQL cloud database.'
                    : status === 'OFFLINE'
                    ? 'Operating offline. Invoices are saved securely in local browser IndexedDB.'
                    : status === 'SYNCING'
                    ? 'Transmitting pending transactions to server...'
                    : 'Some pending transactions require attention. Review queue below.'}
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

          {/* Quick Metrics & Storage Health */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Pending Invoices</span>
              <p className="text-lg font-bold text-slate-800">{pendingCount}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Awaiting cloud commit</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Last Sync Check</span>
              <p className="text-xs font-medium text-slate-700 mt-1">{lastSyncTime || 'Just now'}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Automated 15s interval</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Persistent Storage</span>
                {storageStatus?.isPersisted ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
              <p className="text-xs font-semibold text-emerald-600 mt-1">
                {storageStatus?.isPersisted ? 'Persistence Granted' : 'Standard Browser Storage'}
              </p>
              {storageStatus && (
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  Usage: {storageStatus.usageMB} MB / {storageStatus.quotaMB} MB ({storageStatus.percentUsed}%)
                </p>
              )}
            </div>
          </div>

          {/* Storage Warning if low space */}
          {storageStatus?.isLowSpace && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Storage capacity is critically low ({storageStatus.percentUsed}%). Please free disk space.</span>
            </div>
          )}

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
                All transactions are fully synchronized with Neon cloud database!
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 text-xs">
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

          {/* Emergency Backup & Disaster Recovery Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                title="Download encrypted or checksummed JSON copy of all local outbox invoices"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Recovery Backup</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                title="Restore previously exported recovery backup into this browser"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Restore Backup</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                onClick={handleWarmCache}
                disabled={isTriggering || status === 'OFFLINE'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                title="Download latest products and services into local IndexedDB"
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

      {/* Restore Confirmation & Passphrase Modal */}
      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        title="Restore Recovery Backup"
        subtitle="Safely import pending transactions into local IndexedDB without duplicates"
        maxWidth="md"
      >
        <div className="space-y-4 text-slate-800 text-xs">
          {restoreError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{restoreError}</span>
            </div>
          )}

          {/* Passphrase prompt if encrypted */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700">
              Decryption Passphrase (if backup was encrypted):
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={restorePassphrase}
                onChange={(e) => setRestorePassphrase(e.target.value)}
                placeholder="Enter passphrase..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handlePreviewEncrypted}
                className="px-3 py-1.5 bg-slate-800 text-white rounded font-semibold text-xs cursor-pointer hover:bg-slate-900"
              >
                Validate
              </button>
            </div>
          </div>

          {/* Preview Details */}
          {restorePreview && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <p className="font-bold text-slate-900">Backup Preview:</p>
              <p className="text-slate-600">
                • New Invoices to Restore:{' '}
                <span className="font-bold text-emerald-600">{restorePreview.invoicesCount}</span>
              </p>
              <p className="text-slate-600">
                • Existing Duplicates (Will be skipped):{' '}
                <span className="font-bold text-amber-600">{restorePreview.duplicatesCount}</span>
              </p>
              <p className="text-slate-600">
                • Queue Operations: <span className="font-bold">{restorePreview.queueCount}</span>
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={() => setIsRestoreModalOpen(false)}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRestore}
              disabled={!restorePreview || restorePreview.invoicesCount === 0 || isRestoring}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded text-xs font-bold shadow-xs cursor-pointer"
            >
              {isRestoring ? 'Restoring...' : 'Confirm Restore'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
