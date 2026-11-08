# ISURU Service Center POS — Windows Desktop Application Guide

## 1. Executive Summary

The **ISURU Service POS Desktop Application** (`ISURU-POS-Setup.exe`) is an autonomous, local-first Windows business application designed specifically for automotive service centers. It provides a complete, self-contained billing, inventory management, customer tracking, and vehicle service workflow that runs entirely on the billing computer without requiring an active internet connection, Docker, a separately installed Node.js runtime, or a separately installed PostgreSQL server.

When internet connectivity is available, the desktop application automatically synchronizes pending transactions, customers, vehicles, and invoices with the cloud Hostinger VPS backend and Neon PostgreSQL database.

---

## 2. System Requirements

* **Operating System**: Microsoft Windows 10 (64-bit, Version 1903+) or Windows 11 (64-bit).
* **Processor**: Intel or AMD 64-bit processor (x86_64 / x64), 2.0 GHz or higher.
* **Memory (RAM)**: 4 GB minimum (8 GB recommended).
* **Storage**: 2 GB free disk space (SSD recommended).
* **Display**: Minimum resolution of 1366 × 768 (1920 × 1080 recommended).
* **Network**: Offline-capable; internet connectivity required only for Neon cloud synchronization.
* **Prerequisites**: **None**. Docker, Node.js, and PostgreSQL are bundled into the installer.

---

## 3. Installation Walkthrough (Customer Guide)

1. **Obtain the Installer**:
   * Receive `ISURU-POS-Setup.exe` (SHA-256 verified) from the service administrator or download from the authorized release repository.
2. **Execute Setup**:
   * Double-click `ISURU-POS-Setup.exe`.
   * If Windows SmartScreen displays a confirmation prompt, select **More info** → **Run anyway**.
   * Choose the installation directory (default: `C:\Program Files\ISURU Service POS\`).
   * Check the boxes to create a **Desktop Shortcut** and **Start Menu Shortcut**.
   * Click **Install**.
3. **First-Time Launch**:
   * Launch **ISURU Service POS** from the desktop shortcut.
   * A splash screen will appear: *"Initializing system components..."*.
   * The application automatically:
     - Initializes the local PostgreSQL database cluster.
     - Creates the `isuru_pos` database.
     - Applies all schema migrations.
     - Boots the local Express backend on `http://127.0.0.1:5050`.
     - Opens the React POS Dashboard.
4. **Log In**:
   * Use default administrator credentials or your assigned workshop account.

---

## 4. Windows File & Directory Layout

The application separates application binaries from mutable business data strictly adhering to Windows standard practices:

```
C:\
├── Program Files\
│   └── ISURU Service POS\
│       ├── ISURU Service POS.exe            # Electron primary executable
│       ├── resources\
│       │   ├── app.asar                     # Compiled Electron main process & UI assets
│       │   ├── backend\
│       │   │   ├── dist\                    # Compiled Express backend (ES Modules)
│       │   │   │   ├── package.json         # Module descriptor ({"type": "module"})
│       │   │   │   └── server.js
│       │   │   ├── package.json
│       │   │   ├── prisma\                  # Migrations and schema
│       │   │   └── node_modules\            # Production backend dependencies & Windows Prisma engine
│       │   ├── frontend\dist\               # Compiled React/Vite SPA bundle
│       │   └── pgsql\                       # Portable PostgreSQL 16 binaries
│       │       └── bin\                     # postgres.exe, initdb.exe, psql.exe, pg_dump.exe
│       └── Uninstall ISURU Service POS.exe
│
└── ProgramData\
    └── ISURU Service POS\
        ├── database\                        # Local PostgreSQL PGDATA storage
        ├── config\
        │   └── db_credentials.json          # Randomly generated local PostgreSQL credentials
        ├── logs\
        │   ├── backend.log                  # Express API runtime logs
        │   └── postgres.log                 # PostgreSQL database engine logs
        ├── backups\                         # Automated local PostgreSQL dumps
        └── uploads\                         # Service photos, invoice attachments, and receipts
```

> [!IMPORTANT]
> All business data, customer records, inventory counts, and financial ledgers reside in `C:\ProgramData\ISURU Service POS\database\`. This directory is **preserved** during application updates and reinstallations.

---

## 5. Architectural Process Model

```
ISURU Service POS Desktop Process Flow:

[ ISURU-POS-Setup.exe ]
        │
        ▼
[ Electron Main Process (main.js) ]
        │
        ├── 1. Spawns Portable PostgreSQL 16 (postgres.exe)
        │      └── Listening strictly on 127.0.0.1:5432
        │
        ├── 2. Verifies / Migrates Schema (psql.exe)
        │      └── CREATE DATABASE isuru_pos; applies prisma migrations
        │
        ├── 3. Spawns Local Express Engine (ELECTRON_RUN_AS_NODE=1)
        │      └── cwd: resources/backend
        │      └── Health check: http://127.0.0.1:5050/api/v1/health
        │
        └── 4. Renders React User Interface (BrowserWindow)
               └── Serves UI directly via local backend on localhost
```

* **No Separate Node.js Installation**: The Electron executable itself functions as Node.js via `ELECTRON_RUN_AS_NODE=1`.
* **Zero Console Flashes**: All background services run with `windowsHide: true`.
* **Single Instance Lock**: Built-in Electron single-instance mutex prevents multiple POS windows from conflicting over local database ports.

---

## 6. Offline Billing & Automatic Neon Cloud Synchronization

1. **Local-First Transactions**:
   * Every invoice created, customer registered, vehicle added, or stock movement recorded saves immediately into local PostgreSQL.
   * A persistent `SyncOutbox` record is written atomically inside the same local database transaction.
2. **Offline Resilience**:
   * If there is no internet, the POS operates normally without interruption. Invoices print, inventory updates, and reports generate locally.
3. **Automatic Cloud Sync Worker**:
   * A background worker (`services/sync-worker.service.ts`) periodically inspects internet connectivity.
   * When online, pending operations in `SyncOutbox` are pushed in chronological batches to the Hostinger API endpoint `POST /api/v1/sync/push`.
   * The cloud backend processes operations idempotently into Neon PostgreSQL using client transaction IDs (`clientTxId`).
   * Updated cloud products and services are pulled back to the local POS terminal via `GET /api/v1/sync/pull`.

---

## 7. Backup and Disaster Recovery

### Manual Backup via GUI
1. Navigate to **Settings** → **System Diagnostics** in the desktop application.
2. Click **Export Database Backup**.
3. Choose a destination folder (e.g. an external USB drive or network share).
4. Save the `.sql` backup archive.

### Manual Backup via Command Line
Open PowerShell as Administrator:
```powershell
$pgDump = "C:\Program Files\ISURU Service POS\resources\pgsql\bin\pg_dump.exe"
$dest = "C:\Backup\isuru_pos_manual_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
& $pgDump -h 127.0.0.1 -p 5432 -U isuru_pos_user -d isuru_pos -f $dest
```

### Database Restore Procedure
To restore a backup into a new machine:
```powershell
$psql = "C:\Program Files\ISURU Service POS\resources\pgsql\bin\psql.exe"
& $psql -h 127.0.0.1 -p 5432 -U isuru_pos_user -d isuru_pos -f "C:\Backup\isuru_pos_backup.sql"
```

---

## 8. Troubleshooting & Diagnostics

| Symptom | Diagnostic Step | Resolution |
| :--- | :--- | :--- |
| **"Local backend failed to report healthy"** | Open `C:\ProgramData\ISURU Service POS\logs\backend.log` | Check for database connection issues or corrupted configuration files. The error dialog automatically displays the last 1500 characters of this log. |
| **"Local database did not start"** | Open `C:\ProgramData\ISURU Service POS\logs\postgres.log` | Verify port `5432` is not occupied by another third-party PostgreSQL service. |
| **Printer not listed** | Go to Windows Settings → Printers & Scanners | Ensure thermal/POS printer drivers are installed. Electron enumerates native Windows spooler printers automatically. |
| **Sync status showing offline** | Test internet connectivity via browser | Once internet is restored, sync resumes automatically within 30 seconds. |
