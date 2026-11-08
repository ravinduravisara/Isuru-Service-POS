# ISURU Service Center POS: Neon PostgreSQL Cloud Synchronization

## 1. Cloud Synchronization Overview

The synchronization protocol connects the local POS terminal to Neon Serverless PostgreSQL through the Hostinger Express API. It guarantees:
- **Idempotency**: Retransmissions never create duplicate invoices or double stock deductions.
- **Ordered Batches**: Outbox records are dispatched chronologically.
- **Dual-Code Part Matching**: Resolves slash part codes (`EO-24070 / LR004459`) across cloud catalog items.
- **Non-Destructive Conflict Handling**: Cloud inventory discrepancies log auditable conflicts rather than aborting completed customer transactions.

---

## 2. API Specifications

### 2.1 Batch Outbox Push (`POST /api/v1/sync/push`)

Pushes pending operations from the local billing computer to the cloud backend.

**Request Payload:**
```json
{
  "deviceId": "pos-main",
  "operations": [
    {
      "operationId": "c3d9a1e0-b4f2-4982-b7e1-950c4e123456",
      "entityType": "INVOICE",
      "entityId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "operationType": "CREATE",
      "idempotencyKey": "pos-main-INVOICE-a1b2c3d4-CREATE-c3d9a1e0",
      "payload": {
        "clientTxId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "billNo": "INV-20261108-0001",
        "customerName": "Sunil Perera",
        "customerPhone": "0771234567",
        "vehicleNo": "CAB-1234",
        "vehicleType": "Car",
        "subtotalAmount": 4500,
        "discountAmount": 0,
        "totalAmount": 4500,
        "paymentMethod": "Cash",
        "paymentStatus": "Paid",
        "items": [
          {
            "service": "Engine Oil Replacement",
            "itemId": "EO-24070",
            "qty": 1,
            "rate": 4500,
            "amount": 4500
          }
        ]
      }
    }
  ]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "processedCount": 1,
  "results": [
    {
      "operationId": "c3d9a1e0-b4f2-4982-b7e1-950c4e123456",
      "status": "SYNCED",
      "serverAcknowledgement": "Invoice INV-20261108-0001 synced successfully."
    }
  ]
}
```

**Idempotent Resend Response (200 OK):**
```json
{
  "success": true,
  "processedCount": 1,
  "results": [
    {
      "operationId": "c3d9a1e0-b4f2-4982-b7e1-950c4e123456",
      "status": "SYNCED",
      "serverAcknowledgement": "Already Processed: Invoice INV-20261108-0001 synced successfully."
    }
  ]
}
```

---

### 2.2 Incremental Pull (`GET /api/v1/sync/pull`)

Pulls master catalog reference updates (products, services, and system settings) created or modified after a given timestamp.

**Query Parameters:**
- `since`: ISO 8601 timestamp string (e.g., `?since=2026-11-08T00:00:00.000Z`)

**Response:**
```json
{
  "success": true,
  "serverTime": "2026-11-08T09:30:00.000Z",
  "products": [...],
  "services": [...],
  "settings": [...]
}
```

---

## 3. Stock Conflict Handling Policy

If an offline sale took place locally for 5 units, but Neon reflects only 2 units available (for example, due to remote manual inventory adjustments):
1. **Financial Primacy**: The invoice is **fully committed** to Neon PostgreSQL. The customer’s financial and legal record is preserved.
2. **Stock Adjustment**: Cloud stock decrements by the actual sold quantity.
3. **Audit Conflict Log**: An entry is flagged in `sync_operations` with status `CONFLICT` and description:
   `Part "EO-24070": offline sold 5, cloud had 2. Adjusted.`
4. **Visibility**: Visible in the Sync Status modal for administrator reconciliation.
