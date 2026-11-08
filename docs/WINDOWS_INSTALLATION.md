# ISURU Service Center POS: Windows Desktop Installation Guide

## 1. Overview

The Windows Desktop distribution of **ISURU Service POS** is a fully autonomous, offline-first application packaged into a single installer:

**`ISURU-POS-Setup.exe`**

### Zero Prerequisite Requirements
Unlike development stacks, the end-user **DOES NOT need to install**:
- ❌ Docker Desktop
- ❌ Node.js runtime
- ❌ PostgreSQL database server
- ❌ Git or VS Code

Every required runtime component (portable PostgreSQL 16 engine, Express backend API, and React SPA) is bundled inside the installer.

---

## 2. System Requirements

| Requirement | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Operating System** | Windows 10 (64-bit) Version 1809+ | Windows 11 (64-bit) Version 22H2+ |
| **Processor** | Intel Core i3 / AMD Ryzen 3 | Intel Core i5 / AMD Ryzen 5 or better |
| **RAM** | 4 GB | 8 GB or more |
| **Free Disk Space** | 2 GB (for database & media) | 10 GB+ SSD |
| **Network** | None required for billing | Internet required ONLY for cloud sync |
| **Display** | 1366 x 768 | 1920 x 1080 Full HD |

---

## 3. Installation Walkthrough

1. **Obtain Installer**:
   Download `ISURU-POS-Setup.exe` from the latest GitHub Release or your GitHub Actions build artifacts.
2. **Launch Installer**:
   Double-click `ISURU-POS-Setup.exe`.
3. **Choose Installation Options**:
   - Choose destination (Default: `C:\Program Files\ISURU Service POS`).
   - Check *Create Desktop Shortcut*.
   - Check *Create Start Menu Shortcut*.
4. **Automatic Cluster Initialization**:
   The installer automatically creates the persistent database directory at:
   `C:\ProgramData\ISURU Service POS\database`
5. **Finish & Launch**:
   Check *Launch ISURU Service POS* and click **Finish**.

---

## 4. First-Time Launch Experience

When ISURU Service POS opens for the first time:
1. A brief splash screen appears showing:
   - *"Initializing secure local PostgreSQL cluster..."*
   - *"Applying database schema migrations..."*
   - *"Starting local POS backend API..."*
2. Once the local backend reports healthy on `http://127.0.0.1:5050`, the main POS window opens.
3. The initial Administrator setup screen appears:
   - Default Username: `admin`
   - Default Password: `admin123` *(Prompted to update immediately)*

---

## 5. Offline Operation & Cloud Synchronization

- **Offline Billing**: Cashiers can create customer accounts, register vehicles, process sales, update stock, and print invoices with zero internet connectivity. All transactions commit immediately to local PostgreSQL.
- **Automatic Cloud Sync**: Whenever the computer connects to the internet, the background sync worker drains the persistent outbox (`sync_outbox`) and synchronizes invoices to **Neon PostgreSQL** via the Hostinger API (`https://88.222.242.20:8443`).
