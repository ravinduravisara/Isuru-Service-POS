# ISURU Service Center POS - Production Deployment & Operations Guide

> **System Overview**: Point of Sale and Workshop Management System for ISURU Service Center.  
> **Target Environment**: Ubuntu 22.04 LTS (Hostinger KVM 2 VPS: 2 vCPU, 8 GB RAM, 100 GB SSD)  
> **Public IP**: `88.222.242.20`  
> **Entry Point**: `https://88.222.242.20:8443`  
> **Co-existence**: Runs completely independent of existing IAAC website on ports 80/443 and internal Docker services on 8080.

---

## 1. System Architecture

```mermaid
graph TD
    Client["Client Web Browser / POS Terminal"] -->|HTTPS :8443| NginxProxy["Nginx Frontend Container (isuru-pos-frontend)"]
    NginxProxy -->|Serves Static React Assets| SPA["React.js SPA"]
    NginxProxy -->|Proxies /api & /uploads| BackendAPI["Node.js + Express API (isuru-pos-backend)"]
    BackendAPI -->|Prisma ORM Connection Pool| PostgresDB["PostgreSQL 16 DB (isuru-pos-postgres)"]
    PostgresDB -->|Persists Data| PGVolume[("Docker Volume: postgres_data")]
    BackendAPI -->|Persists Uploads| UploadVolume[("Docker Volume: server_uploads")]
```

### Architecture Highlights
- **Frontend**: React 18 SPA built with Vite and TailwindCSS, served via Nginx with client-side SPA routing fallback and HTTP security headers.
- **Backend**: Node.js 22 LTS with Express, Prisma ORM 6, Zod schema validation, JWT authentication, and structured logging.
- **Database**: PostgreSQL 16 on alpine with connection pooling, transactional stock/financial operations, and strict referential constraints.
- **Isolation**: Custom Docker bridge network (`isuru_pos_network`). PostgreSQL port `5432` is not exposed to the public internet.

---

## 2. PostgreSQL Relational Database Design

The system replaces legacy MongoDB document collections with a normalized PostgreSQL relational database managed by Prisma ORM:

| PostgreSQL Table | Purpose | Relationships & Keys | Financial / Stock Handling |
|---|---|---|---|
| `users` | POS Operators & Admin | Primary key `id` (UUID), unique `username` | bcrypt password hashes |
| `settings` | Business metadata & config | Primary key `id`, unique `key` | Key-value store |
| `customers` | Client registry | Primary key `id`, index on `name`, `phone` | `1 : N` with `vehicles`, `invoices` |
| `vehicles` | Customer vehicles | Foreign key `customerId` → `customers.id` (ON DELETE CASCADE) | `1 : N` with `invoices` |
| `services` | Fixed labor rates | Primary key `id`, unique compound `[category, name]` | `DECIMAL(12,2)` price |
| `products` | Inventory & spare parts | Primary key `id`, unique `itemId` (e.g. `ENG-0001`) | `DECIMAL(12,2)` unit & buying prices, atomic stock deduction |
| `suppliers` | Vendor directory | Primary key `id`, unique `supplierCode` | Live balance aggregations |
| `supply_invoices` | Supplier purchase bills | Primary key `id`, index on `invoiceNo`, `supplierCode` | Cost basis tracking |
| `stock_movements` | Stock audit ledger | Primary key `id`, index on `itemId`, `movedAt` | Negative for sales, positive for purchases |
| `invoices` | Customer sales invoices | Primary key `id`, unique `billNo`, foreign keys to customer & vehicle | `DECIMAL(12,2)` subtotal, discount, total |
| `invoice_items` | Relational line items | Foreign key `invoiceId` → `invoices.id` (ON DELETE CASCADE) | Frozen `rate` and `buyingPrice` for accurate COGS |

---

## 3. Environment Variables Reference

Configuration is managed via `.env`. A complete template is provided in `.env.example`:

| Variable | Description | Example (Local Dev) | Production (Hostinger VPS) |
|---|---|---|---|
| `NODE_ENV` | Application environment | `development` | `production` |
| `PORT` | Backend process port | `5050` | `5050` |
| `FRONTEND_PORT` | Published Nginx HTTP port | `8081` | (internal to compose) |
| `PRODUCTION_HTTPS_PORT` | Published Nginx HTTPS port | `8443` | `8443` |
| `POSTGRES_USER` | PostgreSQL superuser | `isuru_pos_user` | `isuru_pos_prod_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `isuru_dev_pass_2026` | *(Strong 32+ char secret)* |
| `POSTGRES_DB` | Database name | `isuru_pos` | `isuru_pos_production` |
| `POSTGRES_HOST` | Database host | `postgres` (or `127.0.0.1`) | `postgres` |
| `POSTGRES_PORT` | Database port | `5432` | `5432` |
| `DATABASE_URL` | Prisma connection string | `postgresql://isuru_pos_user:pass@postgres:5432/isuru_pos?schema=public` | `postgresql://...` |
| `JWT_SECRET` | Authentication secret | `isuru_service_center_secret` | *(Cryptographically random 64 bytes)* |
| `CLIENT_URL` | Allowed CORS frontend origin | `http://localhost:8081` | `https://88.222.242.20:8443` |
| `MONGODB_URI` | Legacy DB (Migration script only) | `mongodb://127.0.0.1:27017/isuru_billing` | *(Optional / Not required)* |
| `BACKUP_DIR` | Backup storage path | `./backups` | `/var/backups/isuru-pos` |
| `BACKUP_RETENTION_DAYS` | Days to keep backups | `14` | `30` |

---

## 4. Local Quickstart with Docker Compose

### Prerequisites
- Docker Engine 24+ and Docker Compose v2+
- Node.js 20+ (for local development without Docker)

### Step 1: Clone and Configure Environment
```bash
git clone https://github.com/ravinduravisara/Isuru-Service-POS.git
cd Isuru-Service-POS
cp .env.example .env
```

### Step 2: Build and Launch Containers
```bash
docker compose up --build -d
```

### Step 3: Verify Status
```bash
docker compose ps
./scripts/verify-deployment.sh
```

The application is accessible at:
- **Frontend POS UI**: [http://localhost:8081](http://localhost:8081)
- **Backend API Health**: [http://localhost:5050/api/v1/health](http://localhost:5050/api/v1/health)

### Default Initial Credentials
- **Administrator**: `Isuru@6800` / `Isuru@service` (Full access including profit statements, user management, and settings)
- **Staff / Cashier**: `User@123` / `User@service` (POS billing, customers, inventory lookups)

---

## 5. MongoDB to PostgreSQL Data Migration

The migration utility extracts historical data from MongoDB, maps ObjectIds to relational UUIDs, normalizes invoice line items, and imports everything into PostgreSQL idempotently.

```bash
# Dry run verification (Validates counts and connections without writing)
cd backend
npx tsx src/scripts/migration/migrate-mongodb-to-postgres.ts --dry-run

# Execute live migration
npm run migrate:mongo
```

After execution, a reconciliation audit report is automatically updated in `docs/migration-report.md`.

---

## 6. Database Backups and Recovery

### Automated Backup Script
Run the automated backup script manually or via cron:
```bash
./scripts/backup-postgres.sh
```
- Outputs compressed and timestamped archive to `backups/isuru_pos_backup_YYYYMMDD_HHMMSS.sql.gz`.
- Generates a SHA256 checksum file for corruption detection.
- Automatically removes backups older than `BACKUP_RETENTION_DAYS` (default 14 days).

### Automated Daily Scheduling via Crontab
To run backups daily at 02:00 AM:
```bash
crontab -e
# Add the following line:
0 2 * * * /path/to/Isuru-Service-POS/scripts/backup-postgres.sh >> /var/log/isuru-pos-backup.log 2>&1
```

### Offsite Backup Sync (Recommended for Financial Data)
Sync backups to AWS S3, Cloudflare R2, or remote SFTP:
```bash
# Example using rclone to Cloudflare R2 or S3
rclone sync /path/to/Isuru-Service-POS/backups/ remote-bucket:isuru-pos-backups/
```

### Database Restoration Procedure
To restore a backup into PostgreSQL:
```bash
# Safe interactive restoration
./scripts/restore-postgres.sh ./backups/isuru_pos_backup_20261107_000000.sql.gz

# Non-interactive restoration
./scripts/restore-postgres.sh ./backups/isuru_pos_backup_20261107_000000.sql.gz --force
```

---

## 7. Production Deployment (Hostinger VPS Preparation)

### Hostinger VPS Specifications
- **CPU**: 2 vCPU
- **RAM**: 8 GB
- **Storage**: 100 GB SSD
- **Operating System**: Ubuntu 22.04 LTS
- **Public IP**: `88.222.242.20`
- **Existing Services**: IAAC website running on ports 80/443; internal docker on 8080.

### Port Allocation Plan
| Service | Host Port | Protocol | Purpose | Conflict with Existing IAAC? |
|---|---|---|---|---|
| Existing IAAC Website | 80, 443 | HTTP / HTTPS | Main Website | **None (Untouched)** |
| Existing Docker App | 8080 | HTTP | Internal Tool | **None (Untouched)** |
| **ISURU POS Nginx** | **8443** | **HTTPS** | **Public POS Entry Point** | **None (Dedicated)** |
| **ISURU POS Backend** | Internal Docker | HTTP | REST API | **None (Isolated)** |
| **ISURU POS Postgres** | Internal Docker | TCP | Database | **None (Isolated)** |

### Public IP-Based HTTPS Setup on Port 8443
Because no custom domain is used, TLS certificates must be issued for the public IPv4 address `88.222.242.20`.
Options for IP-based SSL certificates:
1. **ZeroSSL IP Certificate** (Supports public IPv4 addresses via ACME `http-01` or file-based validation).
2. **acme.sh client** with IP-SAN support.

#### ZeroSSL / acme.sh Certificate Generation on the VPS:
```bash
# On the VPS (during future deployment turn):
curl https://get.acme.sh | sh
~/.acme.sh/acme.sh --register-account -m admin@isurucenter.lk --server zerossl
~/.acme.sh/acme.sh --issue -d 88.222.242.20 --standalone --httpport 8088 --server zerossl

# Install certificate to POS docker ssl directory
mkdir -p /opt/isuru-pos/docker/ssl
~/.acme.sh/acme.sh --install-cert -d 88.222.242.20 \
  --key-file       /opt/isuru-pos/docker/ssl/privkey.pem  \
  --fullchain-file /opt/isuru-pos/docker/ssl/fullchain.pem \
  --reloadcmd     "docker exec isuru-pos-frontend nginx -s reload"
```

### Production Deployment Commands (Future VPS Turn)
```bash
# 1. Clone deployment branch on VPS
git clone -b deployment https://github.com/ravinduravisara/Isuru-Service-POS.git /opt/isuru-pos
cd /opt/isuru-pos

# 2. Configure production .env
cp .env.example .env
nano .env # Set strong passwords, secrets, and PRODUCTION_HTTPS_PORT=8443

# 3. Launch isolated production Compose stack
docker compose -f compose.prod.yaml up --build -d

# 4. Verify healthy operation
./scripts/verify-deployment.sh
```

---

## 8. Rollback and Update Procedures

### Safe Application Update
```bash
cd /opt/isuru-pos
# 1. Take a fresh pre-update backup
./scripts/backup-postgres.sh

# 2. Pull latest release
git pull origin deployment

# 3. Rebuild and restart containers
docker compose -f compose.prod.yaml up --build -d

# 4. Verify deployment
./scripts/verify-deployment.sh
```

### Rollback Procedure
If an issue occurs after an update:
```bash
# 1. Roll back Git commit
git checkout HEAD~1

# 2. Re-deploy previous containers
docker compose -f compose.prod.yaml up --build -d

# 3. If database schema was affected, restore pre-update database backup
./scripts/restore-postgres.sh /opt/isuru-pos/backups/<pre_update_backup>.sql.gz --force
```
