# ISURU Service Center POS: Desktop Update & Version Upgrade Guide

## 1. Zero-Data-Loss Upgrade Principle

When a new version of the POS application is released (e.g. upgrading from `v1.0.0` to `v1.1.0`):
- All program executables in `C:\Program Files\ISURU Service POS\` are replaced.
- **ALL business data in `C:\ProgramData\ISURU Service POS\` remains untouched.**

The local PostgreSQL data directory, user uploads, logs, database password, and pending sync outbox records are completely separate from the installer binaries.

---

## 2. Standard Update Procedure

1. **Take a Pre-Upgrade Backup** (Recommended best practice):
   Open the POS -> Sync Status Badge -> **Export Backup**.
2. **Download New Installer**:
   Download the new `ISURU-POS-Setup.exe` version.
3. **Run Installer**:
   Double-click the installer. The installer automatically detects the existing installation, stops running processes gracefully, and installs the updated application binaries.
4. **Automatic Database Migration**:
   On first launch of the new version, the backend automatically runs:
   ```bash
   prisma migrate deploy
   ```
   This applies any newly added tables, columns, or indexes non-destructively without resetting or altering existing data.

---

## 3. Rollback Procedure

If an update is incompatible with a legacy hardware peripheral (such as an obsolete barcode reader or thermal printer):
1. Uninstall the new version using Windows Settings -> Apps -> **Installed Apps** -> **ISURU Service POS** -> **Uninstall**.
2. When prompted:
   *"Do you want to retain your local invoice records, customer data, and database backups?"*
   Click **YES**.
3. Install the previous known-good installer version (e.g. `ISURU-POS-Setup-v1.0.0.exe`).
4. Launch the application. The previous version will re-attach to the existing database in `C:\ProgramData\ISURU Service POS`.
