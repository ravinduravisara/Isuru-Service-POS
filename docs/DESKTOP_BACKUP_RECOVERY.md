# ISURU Service Center POS: Desktop Backup & Disaster Recovery Guide

## 1. Backup Strategies on Windows

The Windows Desktop edition provides three layers of disaster recovery:

1. **Automated Internal Backups**: The local POS backend schedules daily logical database dumps to:
   `C:\ProgramData\ISURU Service POS\backups\`
2. **One-Click USB / External Export**: The cashier or owner can export a point-in-time SQL dump directly to an external flash drive via the POS UI.
3. **Encrypted Web Crypto Backup**: Client-side AES-GCM (256-bit) password-encrypted recovery files generated from the Sync Status Badge.

---

## 2. Exporting Backups to an External USB Drive

### Method A: Via the POS Interface
1. In the top-right header, click on the **Sync Status Badge**.
2. Click **Export Encrypted Backup** (or use the Desktop Diagnostics menu -> **Export Database Dump**).
3. Select your external USB drive (e.g. `E:\ISURU_Backups\`) and save the `.sql` or `.json` file.

### Method B: Via Command Line (Batch Script)
Open PowerShell or Command Prompt as Administrator and run:
```cmd
cd "C:\Program Files\ISURU Service POS\resources\pgsql\bin"
pg_dump.exe -h 127.0.0.1 -p 5432 -U isuru_pos_user -d isuru_pos -F c -b -v -f "D:\Backups\isuru_backup.dump"
```

---

## 3. Restoring the Database

If the computer is replaced or the hard drive is formatted:
1. Install a fresh copy of **`ISURU-POS-Setup.exe`**.
2. Open the POS once to allow cluster initialization, then close it.
3. Restore using the bundled `pg_restore.exe`:
```cmd
cd "C:\Program Files\ISURU Service POS\resources\pgsql\bin"
pg_restore.exe -h 127.0.0.1 -p 5432 -U isuru_pos_user -d isuru_pos -c -v "D:\Backups\isuru_backup.dump"
```
4. Re-open ISURU Service POS. All customer profiles, vehicle histories, inventory balances, and invoices will be restored.
