# ISURU Service Center POS: Local Billing Terminal Setup Guide

## 1. Prerequisites

- **Operating System**: macOS, Windows 10/11 (with WSL2), or Ubuntu / Debian Linux
- **Docker**: Docker Desktop or Docker Engine with Docker Compose v2+
- **Network**: Internet access required ONLY for initial Docker image build and npm install. Normal billing operates completely offline.

---

## 2. Quick Setup Instructions

### Step 1: Clone Repository
```bash
git clone https://github.com/ravinduravisara/Isuru-Service-POS.git
cd Isuru-Service-POS
git checkout offline-pos
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure the default local development credentials are set:
```ini
NODE_ENV=development
PORT=5050
FRONTEND_PORT=8081
BACKEND_PORT=5050
POSTGRES_PORT=5432

POSTGRES_USER=isuru_pos_user
POSTGRES_PASSWORD=Isuru2026POS
POSTGRES_DB=isuru_pos

DATABASE_URL=postgresql://isuru_pos_user:Isuru2026POS@postgres:5432/isuru_pos?schema=public
CLOUD_SYNC_URL=https://88.222.242.20:8443
CLOUD_SYNC_ENABLED=true
POS_ROLE=LOCAL_PRIMARY
POS_DEVICE_ID=pos-main
```

### Step 3: Launch Local POS Stack
```bash
./scripts/startup/start-pos-local.sh
```
*On Windows, double-click `scripts\startup\windows-start-pos.bat`.*

### Step 4: Access POS
Open Google Chrome or Microsoft Edge and navigate to:
**`http://localhost:8081`**

Default Administrator Credentials:
- **Username**: `admin`
- **Password**: `admin123` *(Prompted to update on first setup)*

---

## 3. Verifying Local Health

Check running containers:
```bash
docker compose -f compose.yaml ps
```
All three containers should report `healthy` or `running`:
- `isuru-pos-postgres` (PostgreSQL 16)
- `isuru-pos-backend` (Node.js 22 LTS)
- `isuru-pos-frontend` (Nginx + React SPA)

Test the backend health endpoint:
```bash
curl http://localhost:5050/api/v1/health
```
Expected output:
```json
{"status":"ok","service":"ISURU Service Center API","version":"1.0.0"}
```
