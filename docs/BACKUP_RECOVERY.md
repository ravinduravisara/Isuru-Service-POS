# ISURU Service Center POS: Backup & Disaster Recovery Guide

## 1. Multi-Tiered Backup Architecture

Because the primary billing computer holds the authoritative local state for all in-flight offline sales, ISURU Service POS implements a **two-tier backup defense**:

1. **Host-Level Automated Backups**: Native PostgreSQL dumps with gzip compression, SHA256 checksums, and 14-day retention.
2. **Client-Level Encrypted Emergency Recovery**: AES-GCM 256-bit password-protected JSON exports directly from the cashier UI.

---

## 2. Host-Level Automated Backups

### Creating a Backup
Run the automated backup script from the project root:
```bash
./scripts/backup-postgres.sh
```

**Output Assets:**
- PostgreSQL logical dump: `backups/isuru_pos_backup_YYYYMMDD_HHMMSS.sql.gz`
- Workshop uploads dump: `backups/isuru_uploads_backup_YYYYMMDD_HHMMSS.tar.gz`
- SHA256 integrity file: `backups/isuru_pos_backup_YYYYMMDD_HHMMSS.sql.gz.sha256`

### Scheduling Daily Backups (Cron / Task Scheduler)
Add a crontab entry to execute daily at 11:30 PM:
```bash
30 23 * * * cd /opt/isuru-pos && ./scripts/backup-postgres.sh >> /var/log/isuru-backup.log 2>&1
```

---

## 3. Database Restoration

To restore a database dump into a local or isolated staging environment:

```bash
./scripts/restore-postgres.sh backups/isuru_pos_backup_YYYYMMDD_HHMMSS.sql.gz
```

The script will:
1. Verify SHA256 checksum integrity.
2. Prompt for confirmation before applying.
3. Automatically execute `pg_restore` into the active PostgreSQL container.
4. Verify database model integrity post-restoration.

---

## 4. Client-Level Emergency Disaster Recovery

If the billing computer experiences catastrophic hardware failure:
1. **Export**: In the POS header, click the Sync Badge -> **Export Encrypted Backup**. Enter an encryption passphrase.
2. **Transfer**: Save the `.json` file to a secure USB drive or offsite storage.
3. **Restore**: On any replacement computer running ISURU POS, open the Sync Badge -> **Restore Backup**, enter the passphrase, preview the invoices, and click **Confirm Restore**.
4. The replacement terminal loads the pending sales into its local database and synchronizes them to Neon automatically.
