// ==============================================================================
// ISURU SERVICE CENTER POS: ELECTRON MAIN PROCESS
// ==============================================================================
import { app, BrowserWindow, ipcMain, shell, dialog, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ProcessManager } from './processManager.js';
import { PrintManager } from './printManager.js';
import type { PrintInvoiceOptions } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let splashWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

// Ensure single instance lock so multiple copies don't fight over PostgreSQL ports
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

/**
 * Create splash screen displayed during database and backend startup.
 */
function createSplashWindow(): BrowserWindow {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets', 'icon.png')
    : path.join(__dirname, '..', '..', 'resources', 'assets', 'icon.png');

  const splash = new BrowserWindow({
    width: 480,
    height: 380,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const splashPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets', 'splash.html')
    : path.join(__dirname, '..', '..', 'resources', 'assets', 'splash.html');

  if (fs.existsSync(splashPath)) {
    splash.loadFile(splashPath);
  } else {
    splash.loadURL(
      `data:text/html,<html><body style="background:#0f172a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><h3>Starting ISURU POS...</h3></body></html>`
    );
  }

  return splash;
}

/**
 * Load saved window geometry.
 */
function getSavedWindowBounds(): { width: number; height: number; x?: number; y?: number } {
  const defaultBounds = { width: 1400, height: 900 };
  try {
    const boundsFile = path.join(app.getPath('userData'), 'window-bounds.json');
    if (fs.existsSync(boundsFile)) {
      return JSON.parse(fs.readFileSync(boundsFile, 'utf8'));
    }
  } catch {
    // Ignore
  }
  return defaultBounds;
}

/**
 * Save window geometry on change.
 */
function saveWindowBounds(win: BrowserWindow) {
  if (win.isMaximized() || win.isMinimized() || win.isFullScreen()) return;
  try {
    const boundsFile = path.join(app.getPath('userData'), 'window-bounds.json');
    fs.writeFileSync(boundsFile, JSON.stringify(win.getBounds(), null, 2));
  } catch {
    // Ignore
  }
}

/**
 * Create primary application window.
 */
function createMainWindow(targetUrl: string): BrowserWindow {
  const bounds = getSavedWindowBounds();
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets', 'icon.png')
    : path.join(__dirname, '..', '..', 'resources', 'assets', 'icon.png');

  const win = new BrowserWindow({
    ...bounds,
    minWidth: 1024,
    minHeight: 700,
    title: 'ISURU Service POS',
    backgroundColor: '#0f172a',
    show: false,
    autoHideMenuBar: true,
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  win.setMenuBarVisibility(false);

  // Native window control tracking
  win.on('resize', () => saveWindowBounds(win));
  win.on('move', () => saveWindowBounds(win));

  // Security: Prevent navigation away from trusted local backend
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Diagnostics: Capture renderer console messages and load failures
  const dataDir = ProcessManager.getDataDirectory();
  const rendererLogFile = path.join(dataDir, 'logs', 'renderer.log');

  win.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    const logLine = `[Renderer L${level}] ${message} (${sourceId}:${line})\n`;
    try {
      fs.appendFileSync(rendererLogFile, logLine);
    } catch {}
    if (level >= 2) {
      console.warn(logLine.trim());
    }
  });

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    if (errorCode !== -3) { // Ignore user/history navigation aborts
      const errLine = `[Renderer Load Error] Code ${errorCode}: ${errorDescription} on ${validatedURL}\n`;
      try {
        fs.appendFileSync(rendererLogFile, errLine);
      } catch {}
      console.error(errLine.trim());
    }
  });

  win.webContents.on('render-process-gone', (_event, details) => {
    const crashLine = `[Renderer Crash] Reason: ${details.reason}, Exit Code: ${details.exitCode}\n`;
    try {
      fs.appendFileSync(rendererLogFile, crashLine);
    } catch {}
    console.error(crashLine.trim());
  });

  // Keyboard shortcut: Toggle DevTools with F12 for diagnostics
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      win.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  win.loadURL(targetUrl);

  let windowShown = false;
  const showMainWindow = () => {
    if (windowShown) return;
    windowShown = true;
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
    win.show();
    win.focus();
  };

  win.once('ready-to-show', showMainWindow);

  // Fallback: Ensure main window is shown even if ready-to-show is delayed
  setTimeout(showMainWindow, 3500);

  win.on('closed', () => {
    mainWindow = null;
  });

  return win;
}

/**
 * Register secure IPC handlers.
 */
function registerIpcHandlers() {
  ipcMain.on('window-minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    mainWindow?.close();
  });

  ipcMain.handle('window-is-maximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  ipcMain.handle('get-printers', async () => {
    if (!mainWindow) return [];
    return PrintManager.getPrinters(mainWindow);
  });

  ipcMain.handle('print-invoice', async (_, options?: PrintInvoiceOptions) => {
    if (!mainWindow) return { success: false, error: 'Window not active.' };
    return PrintManager.printInvoice(mainWindow, options);
  });

  ipcMain.handle('get-diagnostics', async () => {
    const status = ProcessManager.getStatus();
    return {
      appVersion: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
      backendUrl: `http://127.0.0.1:${status.backendPort}`,
      backendStatus: status.backendStatus,
      postgresStatus: status.postgresStatus,
      postgresPort: status.postgresPort,
      programDataDir: status.dataDir,
      isOnline: navigator?.onLine ?? true,
    };
  });

  ipcMain.handle('open-external', async (_, url: string) => {
    if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
      await shell.openExternal(url);
    }
  });

  ipcMain.handle('export-database-backup', async (_, targetPath?: string) => {
    try {
      let dest = targetPath;
      if (!dest && mainWindow) {
        const res = await dialog.showSaveDialog(mainWindow, {
          title: 'Export ISURU POS Database Backup',
          defaultPath: `isuru_pos_backup_${new Date().toISOString().slice(0, 10)}.sql`,
          filters: [{ name: 'SQL Dump File', extensions: ['sql'] }],
        });
        if (res.canceled || !res.filePath) return { success: false };
        dest = res.filePath;
      }

      if (!dest) return { success: false };
      // Copy latest dump from ProgramData backups
      const dataDir = ProcessManager.getDataDirectory();
      const backupsDir = path.join(dataDir, 'backups');
      const files = fs.readdirSync(backupsDir).filter((f) => f.endsWith('.sql.gz') || f.endsWith('.sql'));

      if (files.length === 0) {
        return { success: false, error: 'No recent database backup found in data directory.' };
      }

      const latest = path.join(backupsDir, files[files.length - 1]);
      fs.copyFileSync(latest, dest);
      return { success: true, filePath: dest };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}

/**
 * Configure application menu with native clipboard and edit capabilities.
 * Prevents Alt-key trapping while maintaining standard shortcuts (Ctrl+C, Ctrl+V, etc.)
 */
function setupApplicationMenu() {
  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

/**
 * Application Lifecycle Initialization
 */
app.whenReady().then(async () => {
  setupApplicationMenu();
  splashWindow = createSplashWindow();
  registerIpcHandlers();

  try {
    // 1. Initialize local PostgreSQL data cluster
    await ProcessManager.initializePostgresCluster((msg) => {
      console.log(`[Startup] ${msg}`);
    });

    // 2. Start local PostgreSQL engine
    await ProcessManager.startPostgres((msg) => {
      console.log(`[Startup] ${msg}`);
    });

    // 3. Ensure database 'isuru_pos' exists and schema migrations are applied
    await ProcessManager.ensureDatabaseAndSchema((msg) => {
      console.log(`[Startup] ${msg}`);
    });

    // 4. Start local Express API backend
    const backendUrl = await ProcessManager.startBackend((msg) => {
      console.log(`[Startup] ${msg}`);
    });

    // 5. Create and show primary application window
    mainWindow = createMainWindow(backendUrl);
  } catch (startupError: any) {
    console.error('[Startup Fatal Error]', startupError);
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
    dialog.showErrorBox(
      'ISURU POS Startup Error',
      `Failed to initialize local POS engine: ${startupError.message}\n\nPlease check Windows event logs or run diagnostics.`
    );
    app.quit();
  }
});

// Clean shutdown handlers
app.on('before-quit', async (event) => {
  if (!isQuitting) {
    event.preventDefault();
    isQuitting = true;
    try {
      await ProcessManager.stopAll();
    } finally {
      app.exit(0);
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
