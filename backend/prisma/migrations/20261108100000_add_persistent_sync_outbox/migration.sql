-- CreateTable
CREATE TABLE IF NOT EXISTS "sync_outbox" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL DEFAULT 'pos-main',
    "operationId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "lastError" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "serverAcknowledgement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "sync_outbox_operationId_key" ON "sync_outbox"("operationId");
CREATE UNIQUE INDEX IF NOT EXISTS "sync_outbox_idempotencyKey_key" ON "sync_outbox"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "sync_outbox_status_idx" ON "sync_outbox"("status");
CREATE INDEX IF NOT EXISTS "sync_outbox_entityType_idx" ON "sync_outbox"("entityType");
CREATE INDEX IF NOT EXISTS "sync_outbox_createdAt_idx" ON "sync_outbox"("createdAt");
