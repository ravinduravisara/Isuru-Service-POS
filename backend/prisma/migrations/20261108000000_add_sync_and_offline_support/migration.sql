-- AlterTable
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "clientTxId" TEXT;
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "isProvisional" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "syncedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "invoices_clientTxId_key" ON "invoices"("clientTxId");
CREATE INDEX IF NOT EXISTS "invoices_clientTxId_idx" ON "invoices"("clientTxId");

-- CreateTable
CREATE TABLE IF NOT EXISTS "sync_operations" (
    "id" TEXT NOT NULL,
    "clientOpId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL DEFAULT 'pos-main',
    "operationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payload" TEXT NOT NULL,
    "response" TEXT,
    "errorMessage" TEXT,
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_operations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "sync_operations_clientOpId_key" ON "sync_operations"("clientOpId");
CREATE INDEX IF NOT EXISTS "sync_operations_clientOpId_idx" ON "sync_operations"("clientOpId");
CREATE INDEX IF NOT EXISTS "sync_operations_deviceId_idx" ON "sync_operations"("deviceId");
CREATE INDEX IF NOT EXISTS "sync_operations_status_idx" ON "sync_operations"("status");
