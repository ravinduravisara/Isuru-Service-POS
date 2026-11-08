# ISURU Service Center POS: Automatic Terminal Startup Guide

This document describes how to configure the billing computer so that the POS starts automatically when the computer boots up, with no manual terminal commands required from cashiers.

---

## 1. Container Restart Policy

The local Docker Compose configuration (`compose.yaml`) specifies:
```yaml
restart: unless-stopped
```
When Docker starts on the host operating system, all three containers (`isuru-pos-postgres`, `isuru-pos-backend`, `isuru-pos-frontend`) restart automatically.

---

## 2. Operating System Specific Startup Configurations

### Option A: macOS (LaunchAgent)

1. Copy the provided LaunchAgent plist to the user's `LaunchAgents` directory:
   ```bash
   mkdir -p ~/Library/LaunchAgents
   cp scripts/startup/macos-launchagent.plist ~/Library/LaunchAgents/com.isuru.pos.startup.plist
   ```
2. Load the service:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.isuru.pos.startup.plist
   ```
3. Ensure Docker Desktop is set to **"Start Docker Desktop when you log in"** in Docker Desktop Settings -> General.

---

### Option B: Windows 10/11 (Startup Folder & Task Scheduler)

1. **Enable Docker at Boot**:
   In Docker Desktop Settings -> General, check:
   - [x] *Start Docker Desktop when you sign in to your computer*
   - [x] *Open Docker Desktop dashboard at startup (Optional)*

2. **Add Startup Shortcut**:
   - Press `Win + R`, type `shell:startup`, and press Enter.
   - Right-click inside the folder -> **New** -> **Shortcut**.
   - Browse to the file:
     `C:\path\to\Isuru-Service-POS\scripts\startup\windows-start-pos.bat`
   - Name the shortcut **"ISURU Service POS"**.

3. **Optional Full-Screen Kiosk Mode**:
   Edit the shortcut to launch Chrome or Edge in application mode:
   ```cmd
   "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:8081
   ```

---

### Option C: Ubuntu / Debian Linux (Systemd Service)

1. Copy the systemd service file:
   ```bash
   sudo cp scripts/startup/linux-systemd-pos.service /etc/systemd/system/isuru-pos.service
   ```
2. Reload systemd daemon and enable service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable isuru-pos.service
   sudo systemctl start isuru-pos.service
   ```
3. Verify status:
   ```bash
   sudo systemctl status isuru-pos.service
   ```
