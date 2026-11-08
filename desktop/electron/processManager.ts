// ==============================================================================
// ISURU SERVICE CENTER POS: DESKTOP PROCESS & DATABASE MANAGER
// ==============================================================================
import path from 'path';
import fs from 'fs';
import os from 'os';
import net from 'net';
import crypto from 'crypto';
import { spawn, execFile, ChildProcess } from 'child_process';
import { app } from 'electron';

export interface ProcessStatus {
  postgresStatus: 'RUNNING' | 'STOPPED' | 'PORT_IN_USE';
  backendStatus: 'ONLINE' | 'OFFLINE' | 'INITIALIZING';
  postgresPort: number;
  backendPort: number;
  dataDir: string;
}

export class ProcessManager {
  private static postgresProcess: ChildProcess | null = null;
  private static backendProcess: ChildProcess | null = null;
  private static postgresPort = 5432;
  private static backendPort = 5050;
  private static dataDir = '';
  private static dbPassword = '';

  /**
   * Resolve appropriate Windows ProgramData or OS User Data directory.
   */
  public static getDataDirectory(): string {
    if (this.dataDir) return this.dataDir;

    if (process.platform === 'win32') {
      const programData = process.env.ProgramData || 'C:\\ProgramData';
      this.dataDir = path.join(programData, 'ISURU Service POS');
    } else {
      this.dataDir = path.join(app.getPath('userData'), 'isuru_pos_data');
    }

    // Ensure all critical operational subdirectories exist
    const subdirs = ['database', 'uploads', 'backups', 'logs', 'config', 'sync'];
    for (const sub of subdirs) {
      fs.mkdirSync(path.join(this.dataDir, sub), { recursive: true });
    }

    return this.dataDir;
  }

  /**
   * Locate bundled PostgreSQL bin folder.
   */
  public static getPostgresBinDir(): string {
    const isPackaged = app.isPackaged;
    const baseDir = isPackaged
      ? path.join(process.resourcesPath, 'pgsql', 'bin')
      : path.join(__dirname, '..', '..', 'windows', 'postgres', 'pgsql', 'bin');

    return baseDir;
  }

  /**
   * Find available TCP port on loopback interface.
   */
  public static async findFreePort(startPort: number): Promise<number> {
    const isPortFree = (port: number): Promise<boolean> =>
      new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', () => resolve(false));
        server.once('listening', () => {
          server.close();
          resolve(true);
        });
        server.listen(port, '127.0.0.1');
      });

    let port = startPort;
    while (!(await isPortFree(port))) {
      port++;
      if (port > startPort + 50) {
        throw new Error(`Unable to find an open port starting from ${startPort}.`);
      }
    }
    return port;
  }

  /**
   * Wait until TCP port is accepting connections.
   */
  public static async waitForPort(port: number, timeoutMs = 15000): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      const connected = await new Promise<boolean>((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(800);
        socket.once('connect', () => {
          socket.destroy();
          resolve(true);
        });
        socket.once('error', () => {
          socket.destroy();
          resolve(false);
        });
        socket.once('timeout', () => {
          socket.destroy();
          resolve(false);
        });
        socket.connect(port, '127.0.0.1');
      });

      if (connected) return true;
      await new Promise((r) => setTimeout(r, 400));
    }
    return false;
  }

  /**
   * Initialize local PostgreSQL database cluster if not already present.
   */
  public static async initializePostgresCluster(
    onProgress?: (message: string) => void
  ): Promise<void> {
    const dataDir = this.getDataDirectory();
    const pgDataDir = path.join(dataDir, 'database');
    const pgBinDir = this.getPostgresBinDir();
    const configDir = path.join(dataDir, 'config');
    const secretFile = path.join(configDir, 'db_credentials.json');

    // Load or generate secure random local password
    if (fs.existsSync(secretFile)) {
      try {
        const creds = JSON.parse(fs.readFileSync(secretFile, 'utf8'));
        this.dbPassword = creds.password;
        this.postgresPort = creds.port || 5432;
      } catch {
        this.dbPassword = crypto.randomBytes(24).toString('hex');
      }
    } else {
      this.dbPassword = crypto.randomBytes(24).toString('hex');
      this.postgresPort = await this.findFreePort(5432);
      fs.writeFileSync(
        secretFile,
        JSON.stringify(
          {
            user: 'isuru_pos_user',
            password: this.dbPassword,
            database: 'isuru_pos',
            port: this.postgresPort,
            createdAt: new Date().toISOString(),
          },
          null,
          2
        ),
        { mode: 0o600 }
      );
    }

    // Check if PGDATA is already initialized
    const pgVersionFile = path.join(pgDataDir, 'PG_VERSION');
    if (fs.existsSync(pgVersionFile)) {
      onProgress?.('Local PostgreSQL database cluster verified.');
      return;
    }

    onProgress?.('Initializing secure local PostgreSQL cluster...');
    const initDbExe = path.join(pgBinDir, process.platform === 'win32' ? 'initdb.exe' : 'initdb');

    if (!fs.existsSync(initDbExe)) {
      // In development mode on macOS, check if local Docker or host postgres is available
      console.warn(`[ProcessManager] initdb not found at ${initDbExe}. Using fallback local host postgres.`);
      return;
    }

    const pwFile = path.join(configDir, '.temp_pw');
    fs.writeFileSync(pwFile, this.dbPassword);

    await new Promise<void>((resolve, reject) => {
      execFile(
        initDbExe,
        [
          '-D',
          pgDataDir,
          '-U',
          'isuru_pos_user',
          '-A',
          'scram-sha-256',
          '--pwfile',
          pwFile,
          '--encoding',
          'UTF8',
          '--locale',
          'C',
        ],
        (err, stdout, stderr) => {
          if (fs.existsSync(pwFile)) fs.unlinkSync(pwFile);
          if (err) {
            console.error('[ProcessManager] initdb failed:', stderr);
            reject(new Error(`PostgreSQL initdb failed: ${stderr || err.message}`));
          } else {
            console.log('[ProcessManager] initdb successful.');
            resolve();
          }
        }
      );
    });

    // Configure postgresql.conf for strictly local loopback listening
    const confFile = path.join(pgDataDir, 'postgresql.conf');
    if (fs.existsSync(confFile)) {
      const confCustom = `
# ISURU Service POS Custom Local Configuration
listen_addresses = '127.0.0.1'
port = ${this.postgresPort}
max_connections = 80
shared_buffers = 128MB
fsync = on
synchronous_commit = on
`;
      fs.appendFileSync(confFile, confCustom);
    }
  }

  /**
   * Start local PostgreSQL daemon.
   */
  public static async startPostgres(onProgress?: (message: string) => void): Promise<void> {
    onProgress?.('Starting local database engine...');
    const dataDir = this.getDataDirectory();
    const pgDataDir = path.join(dataDir, 'database');
    const pgBinDir = this.getPostgresBinDir();
    const postgresExe = path.join(pgBinDir, process.platform === 'win32' ? 'postgres.exe' : 'postgres');

    if (!fs.existsSync(postgresExe)) {
      console.warn('[ProcessManager] Portable postgres.exe not bundled. Attempting port check on 5432.');
      const isAlreadyRunning = await this.waitForPort(this.postgresPort, 2000);
      if (isAlreadyRunning) {
        onProgress?.('Connected to existing local database instance.');
        return;
      }
      throw new Error(`PostgreSQL engine binary was not found at: ${postgresExe}`);
    }

    const logFile = path.join(dataDir, 'logs', 'postgres.log');
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });

    this.postgresProcess = spawn(postgresExe, ['-D', pgDataDir, '-p', String(this.postgresPort)], {
      detached: false,
      stdio: ['ignore', logStream, logStream],
    });

    this.postgresProcess.on('error', (err) => {
      console.error('[ProcessManager] PostgreSQL process error:', err);
    });

    const ready = await this.waitForPort(this.postgresPort, 12000);
    if (!ready) {
      throw new Error(`Local PostgreSQL did not start on port ${this.postgresPort} within timeout.`);
    }

    onProgress?.('Local PostgreSQL engine is running.');
  }

  /**
   * Start local Express API backend process.
   */
  public static async startBackend(onProgress?: (message: string) => void): Promise<string> {
    onProgress?.('Starting local POS backend API...');
    const dataDir = this.getDataDirectory();
    const isPackaged = app.isPackaged;

    const backendEntry = isPackaged
      ? path.join(process.resourcesPath, 'backend', 'dist', 'server.js')
      : path.join(__dirname, '..', '..', '..', 'backend', 'dist', 'server.js');

    // In Electron, process.execPath is the Electron executable.
    // Setting ELECTRON_RUN_AS_NODE=1 makes it run exactly as Node.js without needing a separate node.exe!
    const nodeRuntime = process.execPath;

    const databaseUrl = `postgresql://isuru_pos_user:${this.dbPassword || 'Isuru2026POS'}@127.0.0.1:${this.postgresPort}/isuru_pos?schema=public`;

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      NODE_ENV: 'production',
      PORT: String(this.backendPort),
      DATABASE_URL: databaseUrl,
      JWT_SECRET: 'isuru_pos_desktop_cryptographically_secure_local_secret_2026_minimum_64_bytes!',
      UPLOAD_DIR: path.join(dataDir, 'uploads'),
      CLIENT_BUILD_DIR: isPackaged
        ? path.join(process.resourcesPath, 'frontend', 'dist')
        : path.resolve(__dirname, '..', '..', '..', 'frontend', 'dist'),
      POS_ROLE: 'LOCAL_PRIMARY',
      CLOUD_SYNC_ENABLED: 'true',
      POS_DEVICE_ID: 'pos-main',
    };

    const logFile = path.join(dataDir, 'logs', 'backend.log');
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });

    this.backendProcess = spawn(nodeRuntime, [backendEntry], {
      env,
      detached: false,
      stdio: ['ignore', logStream, logStream],
    });

    this.backendProcess.on('error', (err) => {
      console.error('[ProcessManager] Backend spawn error:', err);
    });

    // Wait for health endpoint
    const backendUrl = `http://127.0.0.1:${this.backendPort}`;
    const ready = await this.waitForHttpHealth(`${backendUrl}/api/v1/health`, 15000);

    if (!ready) {
      throw new Error(`Local backend failed to report healthy at ${backendUrl}/api/v1/health.`);
    }

    onProgress?.('Local POS backend is ready.');
    return backendUrl;
  }

  /**
   * Poll HTTP health endpoint.
   */
  private static async waitForHttpHealth(url: string, timeoutMs: number): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const res = await fetch(url);
        if (res.ok) return true;
      } catch {
        // Retry
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    return false;
  }

  /**
   * Stop all spawned processes cleanly.
   */
  public static async stopAll(): Promise<void> {
    console.log('[ProcessManager] Gracefully terminating child processes...');

    if (this.backendProcess) {
      try {
        this.backendProcess.kill('SIGTERM');
      } catch {
        // Ignore
      }
      this.backendProcess = null;
    }

    if (this.postgresProcess) {
      const pgBinDir = this.getPostgresBinDir();
      const pgCtl = path.join(pgBinDir, process.platform === 'win32' ? 'pg_ctl.exe' : 'pg_ctl');
      const pgDataDir = path.join(this.getDataDirectory(), 'database');

      if (fs.existsSync(pgCtl)) {
        await new Promise<void>((resolve) => {
          execFile(pgCtl, ['stop', '-D', pgDataDir, '-m', 'fast'], () => resolve());
        });
      } else {
        try {
          this.postgresProcess.kill('SIGTERM');
        } catch {
          // Ignore
        }
      }
      this.postgresProcess = null;
    }

    console.log('[ProcessManager] All processes stopped.');
  }

  /**
   * Return diagnostic status.
   */
  public static getStatus(): ProcessStatus {
    return {
      postgresStatus: this.postgresProcess ? 'RUNNING' : 'STOPPED',
      backendStatus: this.backendProcess ? 'ONLINE' : 'OFFLINE',
      postgresPort: this.postgresPort,
      backendPort: this.backendPort,
      dataDir: this.getDataDirectory(),
    };
  }
}
