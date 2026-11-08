# ISURU Service Center POS: Failure Modes & Recovery Matrix

This document provides technical analysis and verified operational procedures for all 11 system failure scenarios specified in the Master Architecture Prompt.

---

## Scenario Matrix

| Scenario | Symptom / Trigger | System Behavior | Recovery Action |
| :--- | :--- | :--- | :--- |
| **1. Internet Disconnected** | Router offline, fiber cut | POS operates with 100% feature parity. Invoices save to local PostgreSQL + outbox. Provisional bill printed. | None required. Automatic sync resumes when internet returns. |
| **2. Hostinger VPS Outage** | Cloud API 502/503 | Local POS continues normal operation. Sync worker logs connection failure with exponential backoff. | Local billing unaffected. Sync drains outbox once VPS recovers. |
| **3. Neon PostgreSQL Outage** | Cloud DB unreachable | Local transactions commit locally. Outbox records remain `PENDING`. | Zero data loss. Sync operations queue safely until Neon is restored. |
| **4. Computer Sudden Restart** | Power cut, OS crash | Docker restart policy (`unless-stopped`) restarts containers. Unsynced transactions persist in PostgreSQL. | Open `http://localhost:8081`. Pending bills remain queued in outbox. |
| **5. High Volume Offline Sales** | 50+ invoices created offline | Local stock decrements atomically for each sale. Invoices queued in `sync_outbox`. | When online, sync worker batches operations (25 per batch) until drained. |
| **6. Interrupted Sync Handshake** | Network drops after cloud commit but before local ack | Cloud receives sale and commits. Local retries upon reconnect. Cloud returns existing ack via `idempotencyKey`. | Handshake completes cleanly. Zero duplicate bills or double stock deductions. |
| **7. Local Backend Restart** | Node.js process restart | PostgreSQL volume holds state. Outbox records remain intact. Background worker restarts. | Seamless auto-recovery in < 5 seconds. |
| **8. Local Frontend Restart** | Nginx container restart | Service Worker serves cached SPA shell or reloads from fresh Nginx. Session preserved via JWT. | Cashier refreshes browser tab. |
| **9. Local PostgreSQL Failure** | Database container stopped | Express API returns HTTP 500. Clear error banner shown on POS UI. | New sales rejected immediately to prevent corrupted or uncommitted records. Restart container via `docker compose up -d`. |
| **10. Hardware Replacement** | Hard drive failure | Replace computer, pull Git repository, restore latest daily backup via `./scripts/restore-postgres.sh`. | All historical customer, vehicle, inventory, and invoice records restored. |
| **11. Concurrent / Conflicting Stock** | Sold 5 offline, cloud stock is 2 | Cloud commits invoice (financial primacy). Cloud logs conflict in `sync_operations`. | Admin reviews conflict log in Sync Center. Actual inventory balance reconciled. |
