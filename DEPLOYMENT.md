# ISURU Service Center POS - Production Deployment & Operations Guide

> **System Overview**: Point of Sale and Workshop Management System for ISURU Service Center.  
> **Target Environment**: Ubuntu 22.04 LTS (Hostinger KVM 2 VPS: 2 vCPU, 8 GB RAM, 100 GB SSD)  
> **Public IP**: `88.222.242.20`  
> **Public Entry Point**: `https://88.222.242.20:8443`  
> **Host Co-existence**: Runs completely independent of existing IAAC website on ports 80/443 and internal Docker services on 8080. Zero port conflicts or service disruptions.

---

## 1. System Architecture

```mermaid
graph TD
    Client["Client Web Browser / POS Terminal"] -->|HTTPS :8443| NginxProxy["Nginx Reverse Proxy (isuru-pos-prod-frontend)"]
    NginxProxy -->|Serves Static SPA Assets| SPA["React.js SPA"]
    NginxProxy -->|Proxies /api & /uploads| BackendAPI["Node.js + Express API (isuru-pos-prod-backend)"]
    BackendAPI -->|Prisma ORM Connection Pool| PostgresDB["PostgreSQL 16 DB (isuru-pos-prod-postgres)"]
    PostgresDB -->|Persists Data| PGVolume[("Docker Volume: isuru_pos_prod_pgdata")]
    BackendAPI -->|Persists Uploads| UploadVolume[("Docker Volume: isuru_pos_prod_uploads")]
```

### Architecture Highlights
- **Frontend**: React 18 SPA built with Vite and TailwindCSS, served via Nginx with client-side SPA routing fallback, gzip compression, and HTTP security headers (`nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`).
- **Backend**: Node.js 22 LTS with Express, Prisma ORM 6.19, Zod schema validation, JWT authentication, and structured logging.
- **Database**: PostgreSQL 16 on Alpine with connection pooling, transactional stock/financial operations, and strict referential constraints.
- **Isolation**: Custom Docker bridge network (`isuru_pos_prod_net`). PostgreSQL port `5432` is strictly private and never published to the public internet or host interfaces.

---

## 2. PostgreSQL Relational Database Design

The system replaces legacy MongoDB document collections with a normalized PostgreSQL relational database managed by Prisma ORM:

| PostgreSQL Table | Purpose | Relationships & Keys | Financial / Stock Handling |
|---|---|---|---|
| `users` | POS Operators & Admin | Primary key `id` (UUID), unique `username` | Salted bcrypt (cost 12) hashes; zero plaintext |
| `settings` | Business metadata & config | Primary key `id`, unique `key` | Key-value store (passwords strictly excluded) |
| `customers` | Client registry | Primary key `id`, index on `name`, `phone` | `1 : N` with `vehicles`, `invoices` |
| `vehicles` | Customer vehicles | Foreign key `customerId` → `customers.id` (ON DELETE CASCADE) | `1 : N` with `invoices` |
| `services` | Fixed labor rates | Primary key `id`, unique compound `[category, name]` | `DECIMAL(12,2)` rate catalog |
| `products` | Inventory & spare parts | Primary key `id`, unique `itemId` (e.g. `OIL-0001`) | `DECIMAL(12,2)` unit & buying prices, conditional atomic stock deduction |
| `suppliers` | Vendor directory | Primary key `id`, unique `supplierCode` | Live balance aggregations |
| `supply_invoices` | Supplier purchase bills | Primary key `id`, index on `invoiceNo`, `supplierCode` | Atomic stock increment & cost basis tracking |
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
| `FRONTEND_PORT` | Published Nginx HTTP port | `8081` | *(Internal to compose)* |
| `PRODUCTION_HTTPS_PORT` | Published Nginx HTTPS port | `8443` | `8443` |
| `POSTGRES_USER` | PostgreSQL user | `isuru_pos_user` | `isuru_pos_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `isuru_dev_pass_2026` | *(Strong random 32+ char secret)* |
| `POSTGRES_DB` | Database name | `isuru_pos` | `isuru_pos` |
| `POSTGRES_HOST` | Database host | `postgres` | `postgres` |
| `DATABASE_URL` | Prisma connection string | `postgresql://isuru_pos_user:...@localhost:5432/isuru_pos?schema=public` | `postgresql://isuru_pos_user:...@postgres:5432/isuru_pos?schema=public` |
| `JWT_SECRET` | Authentication secret (Min 32 chars) | `isuru_dev_secret_key_minimum_32_chars...` | *(Cryptographically random 64 bytes)* |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173,http://localhost:8081` | `https://88.222.242.20:8443,http://localhost:8081` |
| `INITIAL_ADMIN_USERNAME` | First-run Administrator username | `admin` | `admin` |
| `INITIAL_ADMIN_PASSWORD` | First-run Administrator password | `admin123` | *(Strong initial password)* |
| `BACKUP_DIR` | Backup storage path | `./backups` | `/opt/isuru-pos/backups` |
| `BACKUP_RETENTION_DAYS` | Days to keep backups | `14` | `30` |
| `BACKUP_ENCRYPTION_KEY` | Optional OpenSSL AES-256 key | *(Optional)* | *(Strong passphrase for offsite backup encryption)* |

---

## 4. Local Quickstart with Docker Compose

> **Note:** All Dockerfiles, Nginx configurations, and Compose stacks reside on the dedicated **`deployment`** branch.

### Prerequisites
- Docker Desktop or Docker Engine 24+ and Docker Compose v2+
- Node.js 22 LTS (for running outside Docker)

### Step 1: Switch to Deployment Branch and Configure
```bash
git checkout deployment
cp .env.example .env
```

### Step 2: Build and Launch Local Stack
```bash
docker compose up --build -d
```

### Step 3: Verify Status
```bash
docker compose ps
./scripts/verify-deployment.sh
```

- **Frontend POS UI**: [http://localhost:8081](http://localhost:8081)
- **Backend API Health**: [http://localhost:8081/api/v1/health](http://localhost:8081/api/v1/health)

---

## 5. Security & First-Run Setup

### First-Run Administrator Bootstrap
1. If the database has zero users on initial startup, the backend automatically seeds an initial Administrator account using `INITIAL_ADMIN_USERNAME` and `INITIAL_ADMIN_PASSWORD` hashed with salted bcrypt (cost 12).
2. Alternatively, a public first-run setup endpoint `POST /api/v1/auth/setup` is available **only** when `user.count() === 0`. Once an administrator exists, this endpoint is permanently locked (HTTP 403).

### Zero Plaintext Passwords
- Passwords are **never** stored in the `settings` table.
- Credential rotations via `PUT /api/v1/settings/credentials` update the `users` table with bcrypt hashes and purge any legacy password keys from settings.

### Brute-Force Rate Limiting
- Login and setup endpoints are guarded by `express-rate-limit` allowing at most 10 attempts per 15-minute window per IP.

---

## 6. Database Backups, Encryption & Disaster Recovery

### Automated Backup Script
```bash
./scripts/backup-postgres.sh
```
- Dumps PostgreSQL database using `pg_dump` with gzip compression.
- Archives user-uploaded media (`uploads/`) to `.tar.gz`.
- If `BACKUP_ENCRYPTION_KEY` is set, encrypts archives using **OpenSSL AES-256-CBC** (`-pbkdf2 -iter 100000`).
- Generates SHA256 checksums for corruption and tamper detection.
- Automatically purges backups older than retention window (default 14 days).

### Scheduled Daily Backups via Crontab
```bash
crontab -e
# Add line to run daily at 02:00 AM:
0 2 * * * /opt/isuru-pos/scripts/backup-postgres.sh >> /var/log/isuru-pos-backup.log 2>&1
```

### Database Restoration Procedure
```bash
# Safe interactive restore (requests confirmation prompt):
./scripts/restore-postgres.sh ./backups/isuru_pos_backup_YYYYMMDD_HHMMSS.sql.gz

# Non-interactive restore with uploads media:
./scripts/restore-postgres.sh ./backups/isuru_pos_backup_YYYYMMDD_HHMMSS.sql.gz --force --restore-uploads ./backups/isuru_uploads_backup_YYYYMMDD_HHMMSS.tar.gz

# Isolated test restore (never touches live database):
./scripts/restore-postgres.sh ./backups/isuru_pos_backup_YYYYMMDD_HHMMSS.sql.gz --target-db isuru_pos_isolated_test --force
```

---

## 7. Production Deployment (Hostinger VPS on Port 8443)

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

### Public IP TLS Certificate Setup (acme.sh + ZeroSSL)
Because the application runs on a public IP address (`88.222.242.20`) without a custom domain, ZeroSSL issues a 90-day free certificate for public IPv4 addresses.

To avoid interrupting the existing IAAC website on port 80:
1. Ensure the host Nginx includes the standard webroot challenge location:
```nginx
location /.well-known/acme-challenge/ {
    root /var/www/acme-challenge;
}
```
2. Run the automated IP SSL issuance script:
```bash
./scripts/issue-ip-ssl.sh
```
This issues the certificate to `/opt/isuru-pos/docker/ssl/fullchain.pem` and `privkey.pem` and configures automatic renewal via `acme.sh` cron.

---

## 8. GitHub Actions CI/CD Pipeline

The repository includes enterprise-grade automated CI/CD workflows:

### Continuous Integration (`.github/workflows/ci.yml`)
- Triggers on push and pull requests to `main` and `deployment`.
- Spins up an ephemeral PostgreSQL 16 service container.
- Installs dependencies, generates Prisma client, and applies migrations.
- Executes TypeScript static validation across backend and frontend.
- Runs 47 Vitest integration and concurrency tests.
- Validates Docker Compose files and builds Docker images.

### Continuous Deployment (`.github/workflows/deploy.yml`)
- Triggers on push to `deployment` or version tags (`v*.*.*`).
- Requires CI test suite to pass before proceeding.
- Uses protected GitHub Environment (`production`).
- Connects to VPS via SSH using GitHub Secrets:
  - `VPS_HOST`: `88.222.242.20`
  - `VPS_PORT`: `22`
  - `VPS_USER`: dedicated non-root user (e.g. `deploy`)
  - `VPS_SSH_KEY`: ED25519 or RSA private key
- Takes an automated pre-deployment backup of production database and uploads.
- Pulls `deployment` branch and applies reviewed Prisma migrations (`prisma migrate deploy`).
- Rebuilds and launches containers gracefully.
- Runs automated health check against `https://88.222.242.20:8443/api/v1/health`.
- Automatically rolls back to the previous release commit if health checks fail.
- **Never deletes or resets production database volumes.**

---

## 9. Troubleshooting & Operations Runbook

| Symptom | Diagnostic Step | Resolution |
|---|---|---|
| `connect ECONNREFUSED 127.0.0.1:5432` | Check if PostgreSQL container is running: `docker ps -f name=postgres` | Start database: `docker compose -f compose.prod.yaml up -d postgres` |
| `P2002: Unique constraint failed` | Inspect duplicate field (e.g. `itemId`, `billNo`, `username`) | Use unique values or check if record was already migrated |
| `Insufficient stock for item ...` | Requested quantity exceeds inventory | Restock item via Supply Invoices or adjust quantity |
| Nginx 502 Bad Gateway | Backend container may still be initializing migrations | Check backend logs: `docker logs isuru-pos-prod-backend --tail 50` |
| Port 8443 already in use | Run `sudo lsof -i :8443` on VPS | Stop conflicting process or reassign `PRODUCTION_HTTPS_PORT` |
| Certificate Expired | Check expiration: `openssl x509 -in docker/ssl/fullchain.pem -noout -enddate` | Re-run `./scripts/issue-ip-ssl.sh` |
