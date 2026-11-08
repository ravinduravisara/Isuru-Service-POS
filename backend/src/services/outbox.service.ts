// ==============================================================================
// ISURU SERVICE CENTER POS: TRANSACTIONAL OUTBOX SERVICE
// ==============================================================================
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import crypto from 'crypto';

export type OutboxEntityType =
  | 'INVOICE'
  | 'CUSTOMER'
  | 'VEHICLE'
  | 'PRODUCT'
  | 'SERVICE'
  | 'STOCK_MOVEMENT'
  | 'SUPPLY_INVOICE'
  | 'SETTLEMENT'
  | 'SETTING'
  | 'SUPPLIER';

export type OutboxOperationType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface RecordOutboxParams {
  entityType: OutboxEntityType;
  entityId: string;
  operationType: OutboxOperationType;
  payload: Record<string, any>;
  idempotencyKey?: string;
  deviceId?: string;
}

/**
 * Record an outbox operation atomically within a Prisma database transaction.
 * Guarantees that business entity mutation and outbox record are committed together.
 */
export async function recordOutboxOperation(
  tx: Prisma.TransactionClient,
  params: RecordOutboxParams
) {
  const deviceId = params.deviceId || process.env.POS_DEVICE_ID || 'pos-main';
  const operationId = crypto.randomUUID();
  const idempotencyKey =
    params.idempotencyKey ||
    `${deviceId}-${params.entityType}-${params.entityId}-${params.operationType}-${operationId.slice(0, 8)}`;

  const serializedPayload = JSON.stringify(params.payload);

  return tx.syncOutbox.create({
    data: {
      deviceId,
      operationId,
      entityType: params.entityType,
      entityId: params.entityId,
      operationType: params.operationType,
      payload: serializedPayload,
      status: 'PENDING',
      retryCount: 0,
      idempotencyKey,
    },
  });
}

/**
 * Fetch pending or failed outbox operations eligible for synchronization.
 */
export async function getPendingOutboxOperations(limit = 25) {
  return prisma.syncOutbox.findMany({
    where: {
      status: { in: ['PENDING', 'FAILED'] },
      retryCount: { lt: 50 },
    },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}

/**
 * Mark an outbox operation as successfully synchronized.
 */
export async function markOutboxSynced(id: string, serverAcknowledgement: string) {
  return prisma.syncOutbox.update({
    where: { id },
    data: {
      status: 'SYNCED',
      serverAcknowledgement,
      lastAttemptAt: new Date(),
      lastError: null,
    },
  });
}

/**
 * Mark an outbox operation as failed with backoff information.
 */
export async function markOutboxFailed(id: string, errorMessage: string) {
  return prisma.syncOutbox.update({
    where: { id },
    data: {
      status: 'FAILED',
      lastError: errorMessage,
      lastAttemptAt: new Date(),
      retryCount: { increment: 1 },
    },
  });
}

/**
 * Mark an outbox operation as conflicting with cloud state.
 */
export async function markOutboxConflict(id: string, conflictMessage: string) {
  return prisma.syncOutbox.update({
    where: { id },
    data: {
      status: 'CONFLICT',
      lastError: conflictMessage,
      lastAttemptAt: new Date(),
    },
  });
}

/**
 * Query summary statistics for synchronization monitoring.
 */
export async function getOutboxStats() {
  const [pending, synced, failed, conflict, lastSynced] = await Promise.all([
    prisma.syncOutbox.count({ where: { status: 'PENDING' } }),
    prisma.syncOutbox.count({ where: { status: 'SYNCED' } }),
    prisma.syncOutbox.count({ where: { status: 'FAILED' } }),
    prisma.syncOutbox.count({ where: { status: 'CONFLICT' } }),
    prisma.syncOutbox.findFirst({
      where: { status: 'SYNCED' },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    }),
  ]);

  return {
    pendingCount: pending,
    syncedCount: synced,
    failedCount: failed,
    conflictCount: conflict,
    lastSuccessfulSync: lastSynced?.updatedAt || null,
  };
}
