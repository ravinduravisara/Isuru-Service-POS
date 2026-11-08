# ISURU Service Center POS: Local-First Architecture Specification

## 1. Architectural Philosophy

The ISURU Service Center POS uses a **Local-First Distributed Architecture**. The service center billing computer operates autonomously using **Local PostgreSQL** (`isuru-pos-postgres`), an Express.js backend, and a React frontend served over Nginx.

```
┌─────────────────────────────────────────────────────────────┐
│                    BILLING TERMINAL (LOCAL)                 │
│                                                             │
│   Cashier Browser (React SPA + Workbox PWA Shell)           │
│                          │                                  │
│                          ▼                                  │
│   Nginx Reverse Proxy (:8081) ───► Express Backend (:5050)  │
│                                          │                  │
│                                          ▼                  │
│                         ┌────────────────────────────────┐  │
│                         │ Local PostgreSQL (Operational) │  │
│                         │  - invoices, customers, items │  │
│                         │  - sync_outbox (Persistent)    │  │
│                         └────────────────────────────────┘  │
│                                          ▲                  │
│                                          │                  │
│                             Local Background Sync Worker    │
└──────────────────────────────────────────┼──────────────────┘
                                           │ (Internet Available)
                                           │ POST /api/v1/sync/push
                                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   CLOUD INFRASTRUCTURE                      │
│                                                             │
│   Hostinger KVM 2 VPS (Nginx :8443 Reverse Proxy)           │
│                          │                                  │
│                          ▼                                  │
│   Cloud Express API (/api/v1/sync/push, /pull, /status)     │
│                          │                                  │
│                          ▼                                  │
│   Neon Serverless PostgreSQL (Synchronized Master Copy)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Local-First Write Lifecycle

Every business transaction follows a strict 7-step atomic lifecycle:

1. **Input & Validation**: Cashier enters bill details; local Express validates line items, vehicle numbers, and customer profiles.
2. **Atomic Row Locking**: For inventory items, the local PostgreSQL row is locked (`SELECT ... FOR UPDATE`) to prevent overselling.
3. **Local Commit**: Invoice, line items, and negative stock movements are committed to local PostgreSQL.
4. **Outbox Persistence**: In the **exact same database transaction**, an outbox entry is written to `sync_outbox` with status `PENDING` and a unique `idempotencyKey`.
5. **Instant Cashier Confirmation**: The local transaction commits, and the invoice is displayed and printed immediately (`OFF-YYYYMMDD-XXXX` or `INV-YYYYMMDD-XXXX`).
6. **Zero Cloud Latency**: The cashier never waits for Neon PostgreSQL, Hostinger VPS, or external networks to finalize a sale.
7. **Asynchronous Cloud Sync**: The local background sync worker drains the outbox to Neon whenever connectivity is present.

---

## 3. Persistent Sync Outbox (`sync_outbox`)

The `sync_outbox` table in local PostgreSQL guarantees durable queuing that survives process restarts and power cuts:

| Column | Type | Purpose |
| :--- | :--- | :--- |
| `id` | `TEXT (PK)` | Unique record identifier (UUID) |
| `deviceId` | `TEXT` | Terminal hardware identifier (default: `pos-main`) |
| `operationId` | `TEXT (UNIQUE)` | Distributed operation UUID |
| `entityType` | `TEXT` | Entity kind (`INVOICE`, `CUSTOMER`, `PRODUCT`, `SERVICE`, `SETTLEMENT`) |
| `entityId` | `TEXT` | Database ID of the primary entity |
| `operationType` | `TEXT` | `CREATE`, `UPDATE`, `DELETE` |
| `payload` | `TEXT (JSON)` | Complete serialized entity snapshot |
| `status` | `TEXT` | `PENDING`, `PROCESSING`, `SYNCED`, `FAILED`, `CONFLICT` |
| `retryCount` | `INTEGER` | Backoff counter (stops retry at 50) |
| `lastAttemptAt`| `TIMESTAMP` | Last network transmission timestamp |
| `lastError` | `TEXT` | Server or network diagnostic failure reason |
| `idempotencyKey`| `TEXT (UNIQUE)`| Guaranteed single-execution token |
| `serverAcknowledgement`| `TEXT` | Cloud commit verification token |
