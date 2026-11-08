# ISURU Service Center POS: Desktop Architecture Specification

## 1. Process & Runtime Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                 ISURU-POS-Setup.exe (NSIS)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Installs to
                               ▼
┌─────────────────────────────────────────────────────────────┐
│       Program Files\ISURU Service POS (Binaries Only)       │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Electron Main Process (desktop/electron/main.ts)    │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │ Manages                      │
│            ┌─────────────────┴─────────────────┐            │
│            ▼                                   ▼            │
│   ┌────────────────────────┐          ┌─────────────────┐   │
│   │ Portable PostgreSQL 16 │          │ Express Backend │   │
│   │ (bin/postgres.exe)     │◄─────────┤ (server.js)     │   │
│   └────────────────────────┘          └────────┬────────┘   │
│                                                │ Serves     │
│                                                ▼            │
│                              ┌──────────────────────────┐   │
│                              │ React 18 SPA (Chromium)  │   │
│                              └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                               ▲ Reads & Writes
                               │
┌──────────────────────────────┴──────────────────────────────┐
│       ProgramData\ISURU Service POS (Persistent Data)       │
│                                                             │
│   database/   (PGDATA cluster - NEVER deleted on updates)   │
│   uploads/    (Workshop logo media)                         │
│   backups/    (Daily automated SQL dumps)                   │
│   logs/       (PostgreSQL & Backend diagnostic logs)        │
│   config/     (Secure local database credentials)           │
│   sync/       (Outbox recovery journal)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Separation Principle

To guarantee that future software updates never erase or corrupt historical sales data:
1. **Application Executables** (`C:\Program Files\ISURU Service POS\`):
   Contains read-only application code, Chromium binaries, Express bundle, and portable PostgreSQL binaries. Can be replaced entirely during application updates.
2. **Business Data** (`C:\ProgramData\ISURU Service POS\`):
   Contains the active PostgreSQL database cluster, user uploads, logs, and backups. This directory is **strictly preserved** across installations, updates, and uninstalls.

---

## 3. PostgreSQL Cluster Lifecycle

1. **Initialization**:
   On first launch, `ProcessManager` detects if `PG_VERSION` exists in `ProgramData\...\database`. If missing:
   - Generates a cryptographically random 32-character password.
   - Saves credentials to `ProgramData\...\config\db_credentials.json` with restricted access permissions (`0600`).
   - Invokes `initdb.exe -U isuru_pos_user -A scram-sha-256`.
   - Modifies `postgresql.conf` to bind strictly to `127.0.0.1` on an available port (default 5432).
2. **Port Conflict Detection**:
   If port 5432 is occupied by an external service, `ProcessManager.findFreePort()` scans upward (`5433`, `5434`, etc.) and automatically binds PostgreSQL to an unoccupied port without conflicting with host software.
3. **Graceful Shutdown**:
   When the user exits the application, Electron’s `before-quit` handler executes `pg_ctl.exe stop -m fast` to flush the Write-Ahead Log (WAL) to disk before terminating.

---

## 4. Electron Security Hardening

- **`contextIsolation: true`**: The React renderer runs in an isolated context and cannot access native Node.js APIs directly.
- **`nodeIntegration: false`**: Direct Node.js access is completely disabled in the DOM.
- **Strict Navigation Control**: External web links (`http://`, `https://`) are intercepted and launched in the user's default Windows browser via `shell.openExternal()`. They cannot navigate the Electron window.
- **Preload API Boundary**: Only explicitly declared methods (`printInvoice`, `getPrinters`, `getDiagnostics`, `exportDatabaseBackup`) are bridged via `window.desktopAPI`.
