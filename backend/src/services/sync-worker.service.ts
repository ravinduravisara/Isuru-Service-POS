// ==============================================================================
// ISURU SERVICE CENTER POS: BACKGROUND LOCAL SYNC WORKER
// ==============================================================================
import { ENV } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import {
  getPendingOutboxOperations,
  markOutboxSynced,
  markOutboxFailed,
  markOutboxConflict,
  getOutboxStats,
} from './outbox.service.js';

interface SyncWorkerState {
  isRunning: boolean;
  isSyncing: boolean;
  cloudStatus: 'ONLINE' | 'OFFLINE';
  lastAttemptAt: Date | null;
  lastSuccessAt: Date | null;
  lastError: string | null;
  consecutiveFailures: number;
  lastPullTime: Date | null;
}

const state: SyncWorkerState = {
  isRunning: false,
  isSyncing: false,
  cloudStatus: 'OFFLINE',
  lastAttemptAt: null,
  lastSuccessAt: null,
  lastError: null,
  consecutiveFailures: 0,
  lastPullTime: null,
};

let syncTimer: NodeJS.Timeout | null = null;

/**
 * Check if the remote cloud API is accessible and healthy.
 */
export async function checkCloudHealth(timeoutMs = 4000): Promise<boolean> {
  if (!ENV.CLOUD_SYNC_ENABLED) return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const healthUrl = `${ENV.CLOUD_SYNC_URL.replace(/\/$/, '')}/api/v1/sync/status`;
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-POS-Device-Id': ENV.POS_DEVICE_ID,
      },
      signal: controller.signal,
    });

    clearTimeout(timer);
    return response.ok;
  } catch (err: any) {
    clearTimeout(timer);
    return false;
  }
}

/**
 * Execute a single cycle of outbox synchronization (push) and cloud updates (pull).
 */
export async function runSyncCycle(): Promise<{
  pushedCount: number;
  syncedCount: number;
  failedCount: number;
  conflictCount: number;
  pulledCount: number;
  isOnline: boolean;
}> {
  if (state.isSyncing) {
    return { pushedCount: 0, syncedCount: 0, failedCount: 0, conflictCount: 0, pulledCount: 0, isOnline: state.cloudStatus === 'ONLINE' };
  }

  state.isSyncing = true;
  state.lastAttemptAt = new Date();

  let pushedCount = 0;
  let syncedCount = 0;
  let failedCount = 0;
  let conflictCount = 0;
  let pulledCount = 0;

  try {
    // 1. Verify cloud connectivity
    const isOnline = await checkCloudHealth();
    state.cloudStatus = isOnline ? 'ONLINE' : 'OFFLINE';

    if (!isOnline) {
      state.consecutiveFailures++;
      state.lastError = 'Cloud endpoint unreachable or offline.';
      return { pushedCount, syncedCount, failedCount, conflictCount, pulledCount, isOnline: false };
    }

    // 2. Fetch pending local outbox operations
    const pendingOps = await getPendingOutboxOperations(25);
    pushedCount = pendingOps.length;

    if (pendingOps.length > 0) {
      const pushUrl = `${ENV.CLOUD_SYNC_URL.replace(/\/$/, '')}/api/v1/sync/push`;

      const controller = new AbortController();
      const pushTimer = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(pushUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-POS-Device-Id': ENV.POS_DEVICE_ID,
          },
          body: JSON.stringify({
            deviceId: ENV.POS_DEVICE_ID,
            operations: pendingOps.map((op) => ({
              id: op.id,
              operationId: op.operationId,
              entityType: op.entityType,
              entityId: op.entityId,
              operationType: op.operationType,
              payload: JSON.parse(op.payload),
              idempotencyKey: op.idempotencyKey,
              createdAt: op.createdAt.toISOString(),
            })),
          }),
          signal: controller.signal,
        });

        clearTimeout(pushTimer);

        if (response.ok) {
          const result = (await response.json()) as any;
          const acknowledgements: Array<{
            operationId: string;
            status: 'SYNCED' | 'CONFLICT' | 'FAILED';
            serverAcknowledgement?: string;
            error?: string;
          }> = result.results || [];

          for (const ack of acknowledgements) {
            const op = pendingOps.find((o) => o.operationId === ack.operationId);
            if (!op) continue;

            if (ack.status === 'SYNCED') {
              await markOutboxSynced(op.id, ack.serverAcknowledgement || 'OK');
              syncedCount++;
            } else if (ack.status === 'CONFLICT') {
              await markOutboxConflict(op.id, ack.error || 'Cloud conflict detected');
              conflictCount++;
            } else {
              await markOutboxFailed(op.id, ack.error || 'Server rejected operation');
              failedCount++;
            }
          }

          state.lastSuccessAt = new Date();
          state.consecutiveFailures = 0;
          state.lastError = null;
        } else {
          const errText = await response.text();
          for (const op of pendingOps) {
            await markOutboxFailed(op.id, `Server HTTP ${response.status}: ${errText.slice(0, 200)}`);
          }
          failedCount = pendingOps.length;
        }
      } catch (err: any) {
        clearTimeout(pushTimer);
        for (const op of pendingOps) {
          await markOutboxFailed(op.id, `Network push error: ${err.message}`);
        }
        failedCount = pendingOps.length;
      }
    }

    // 3. Two-Way Pull: Download authorized remote changes if last pull is older than 5 minutes
    const now = new Date();
    const shouldPull = !state.lastPullTime || now.getTime() - state.lastPullTime.getTime() > 5 * 60 * 1000;

    if (shouldPull) {
      try {
        const pullUrl = new URL(`${ENV.CLOUD_SYNC_URL.replace(/\/$/, '')}/api/v1/sync/pull`);
        if (state.lastPullTime) {
          pullUrl.searchParams.set('since', state.lastPullTime.toISOString());
        }

        const pullController = new AbortController();
        const pullTimer = setTimeout(() => pullController.abort(), 10000);

        const pullRes = await fetch(pullUrl.toString(), {
          headers: {
            'Accept': 'application/json',
            'X-POS-Device-Id': ENV.POS_DEVICE_ID,
          },
          signal: pullController.signal,
        });

        clearTimeout(pullTimer);

        if (pullRes.ok) {
          const pullData = (await pullRes.json()) as any;
          const remoteProducts = pullData.products || [];
          const remoteServices = pullData.services || [];

          // Incrementally upsert non-conflicting remote products and services locally
          await prisma.$transaction(async (tx) => {
            for (const p of remoteProducts) {
              const existing = await tx.product.findUnique({ where: { itemId: p.itemId } });
              if (!existing) {
                await tx.product.create({
                  data: {
                    itemId: p.itemId,
                    itemName: p.itemName,
                    brand: p.brand || '',
                    quantity: p.quantity,
                    unitPrice: p.unitPrice,
                    buyingPrice: p.buyingPrice,
                    supplierCode: p.supplierCode || '',
                    paymentMethod: p.paymentMethod || 'Cash',
                  },
                });
                pulledCount++;
              }
            }

            for (const s of remoteServices) {
              const existing = await tx.service.findFirst({
                where: { category: s.category, name: s.name },
              });
              if (!existing) {
                await tx.service.create({
                  data: {
                    category: s.category,
                    name: s.name,
                    price: s.price,
                    description: s.description || '',
                  },
                });
                pulledCount++;
              }
            }
          });

          state.lastPullTime = now;
        }
      } catch (pullErr: any) {
        // Pull failure does not block push
        console.warn('[Sync Worker] Incremental pull skipped:', pullErr.message);
      }
    }

    return {
      pushedCount,
      syncedCount,
      failedCount,
      conflictCount,
      pulledCount,
      isOnline: true,
    };
  } finally {
    state.isSyncing = false;
  }
}

/**
 * Get the current operational status of the sync worker.
 */
export async function getSyncWorkerStatus() {
  const outboxStats = await getOutboxStats();

  return {
    role: ENV.POS_ROLE,
    deviceId: ENV.POS_DEVICE_ID,
    cloudStatus: state.cloudStatus,
    isSyncing: state.isSyncing,
    lastAttemptAt: state.lastAttemptAt,
    lastSuccessAt: state.lastSuccessAt,
    lastPullTime: state.lastPullTime,
    lastError: state.lastError,
    consecutiveFailures: state.consecutiveFailures,
    outbox: outboxStats,
  };
}

/**
 * Start the sync worker timer.
 */
export function startSyncWorker() {
  if (state.isRunning || !ENV.CLOUD_SYNC_ENABLED) return;
  state.isRunning = true;

  console.log(`[Sync Worker] Started with interval ${ENV.CLOUD_SYNC_INTERVAL_MS}ms. Target: ${ENV.CLOUD_SYNC_URL}`);

  // Run initial cycle after brief delay (3s) to allow db connections to settle
  setTimeout(() => {
    runSyncCycle().catch((err) => console.error('[Sync Worker] Cycle error:', err));
  }, 3000);

  syncTimer = setInterval(() => {
    runSyncCycle().catch((err) => console.error('[Sync Worker] Periodic cycle error:', err));
  }, ENV.CLOUD_SYNC_INTERVAL_MS);
}

/**
 * Stop the sync worker timer.
 */
export function stopSyncWorker() {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
  state.isRunning = false;
  console.log('[Sync Worker] Stopped.');
}
