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

    // Check if PostgreSQL is already running on this port
    const isAlreadyRunning = await this.waitForPort(this.postgresPort, 1500);
    if (isAlreadyRunning) {
      console.log(`[ProcessManager] Local PostgreSQL is already active on port ${this.postgresPort}.`);
      onProgress?.('Local PostgreSQL engine is running.');
      return;
    }

    if (!fs.existsSync(postgresExe)) {
      throw new Error(`PostgreSQL engine binary was not found at: ${postgresExe}`);
    }

    const logFile = path.join(dataDir, 'logs', 'postgres.log');
    let logFd: number | 'ignore' = 'ignore';
    try {
      logFd = fs.openSync(logFile, 'a');
    } catch (e) {
      console.warn('[ProcessManager] Could not open postgres.log for writing:', e);
    }

    this.postgresProcess = spawn(postgresExe, ['-D', pgDataDir, '-p', String(this.postgresPort)], {
      detached: false,
      stdio: ['ignore', logFd, logFd],
      windowsHide: true,
    });

    this.postgresProcess.on('error', (err) => {
      console.error('[ProcessManager] PostgreSQL process error:', err);
    });

    const ready = await this.waitForPort(this.postgresPort, 15000);
    if (!ready) {
      let logTail = '';
      try {
        if (fs.existsSync(logFile)) {
          const logContent = fs.readFileSync(logFile, 'utf8');
          logTail = logContent.slice(-1500).trim();
        }
      } catch {}
      throw new Error(
        `Local PostgreSQL did not start on port ${this.postgresPort} within timeout.${
          logTail ? `\n\nPostgreSQL Log:\n${logTail}` : ''
        }`
      );
    }

    onProgress?.('Local PostgreSQL engine is running.');
  }

  /**
   * Ensure database 'isuru_pos' exists and all Prisma migrations are applied.
   */
  public static async ensureDatabaseAndSchema(onProgress?: (message: string) => void): Promise<void> {
    onProgress?.('Verifying database & schema migrations...');
    const pgBinDir = this.getPostgresBinDir();
    const psqlExe = path.join(pgBinDir, process.platform === 'win32' ? 'psql.exe' : 'psql');

    if (!fs.existsSync(psqlExe)) {
      console.warn(`[ProcessManager] psql binary not found at ${psqlExe}. Skipping automated migration check.`);
      return;
    }

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PGPASSWORD: this.dbPassword || 'Isuru2026POS',
    };

    const runPsql = (db: string, sqlOrFile: string, isFile = false): Promise<string> => {
      return new Promise((resolve, reject) => {
        const args = [
          '-h', '127.0.0.1',
          '-p', String(this.postgresPort),
          '-U', 'isuru_pos_user',
          '-d', db,
          '-t',
          '-A',
        ];
        if (isFile) {
          args.push('-f', sqlOrFile);
        } else {
          args.push('-c', sqlOrFile);
        }

        execFile(psqlExe, args, { env, windowsHide: true }, (err, stdout, stderr) => {
          if (err) {
            console.error(`[ProcessManager] psql error (${sqlOrFile}):`, stderr || err.message);
            reject(new Error(`psql error: ${stderr || err.message}`));
          } else {
            resolve(stdout.trim());
          }
        });
      });
    };

    // 1. Ensure 'isuru_pos' database exists
    try {
      const dbCheck = await runPsql('postgres', "SELECT 1 FROM pg_database WHERE datname = 'isuru_pos';");
      if (dbCheck !== '1') {
        onProgress?.('Creating local database isuru_pos...');
        await runPsql('postgres', 'CREATE DATABASE isuru_pos;');
        console.log('[ProcessManager] Database isuru_pos created successfully.');
      }
    } catch (err: any) {
      console.warn('[ProcessManager] Database check/create note:', err.message);
    }

    const isPackaged = app.isPackaged;
    const prismaBase = isPackaged
      ? path.join(process.resourcesPath, 'backend', 'prisma')
      : path.join(__dirname, '..', '..', '..', 'backend', 'prisma');

    // Quick verification: If core tables already exist AND seed user & products exist, skip redundant re-runs
    try {
      const tableCheck = await runPsql('isuru_pos', "SELECT to_regclass('public.users');");
      if (tableCheck && tableCheck.includes('users')) {
        const isuruCheck = await runPsql('isuru_pos', "SELECT count(*) FROM users WHERE LOWER(username) = 'isuru@6800';");
        const prodCheck = await runPsql('isuru_pos', "SELECT count(*) FROM products;");
        if (isuruCheck && parseInt(isuruCheck, 10) > 0 && prodCheck && parseInt(prodCheck, 10) > 0) {
          console.log('[ProcessManager] Database tables, production accounts, and catalog verified.');
          onProgress?.('Local database verified.');
          return;
        }
      }
    } catch {}

    // 2. Locate migrations
    const migrationsBase = path.join(prismaBase, 'migrations');
    if (fs.existsSync(migrationsBase)) {
      try {
        const entries = fs.readdirSync(migrationsBase, { withFileTypes: true });
        const migrationDirs = entries
          .filter((e) => e.isDirectory())
          .map((e) => e.name)
          .sort(); // Run 20261107..., 20261108... in chronological order

        for (const mDir of migrationDirs) {
          const sqlFile = path.join(migrationsBase, mDir, 'migration.sql');
          if (fs.existsSync(sqlFile)) {
            onProgress?.(`Applying schema migration ${mDir}...`);
            try {
              await runPsql('isuru_pos', sqlFile, true);
              console.log(`[ProcessManager] Applied migration: ${mDir}`);
            } catch (mErr: any) {
              console.warn(`[ProcessManager] Migration notice for ${mDir}:`, mErr.message);
            }
          }
        }
      } catch (err: any) {
        console.error('[ProcessManager] Error applying migrations:', err);
      }
    }

    // 3. Apply Production Offline Seed Data (Users, Settings, Suppliers, Services, Products)
    const seedSqlFile = path.join(prismaBase, 'seed-data.sql');
    if (fs.existsSync(seedSqlFile)) {
      onProgress?.('Seeding production data (users, inventory, services)...');
      try {
        await runPsql('isuru_pos', seedSqlFile, true);
        console.log('[ProcessManager] Production offline seed data applied successfully.');
      } catch (seedErr: any) {
        console.warn('[ProcessManager] Seed SQL application notice:', seedErr.message);
      }
    }

    onProgress?.('Local database and tables verified.');
  }

  /**
   * Start local Express API backend process.
   */
  public static async startBackend(onProgress?: (message: string) => void): Promise<string> {
    onProgress?.('Starting local POS backend API...');
    const dataDir = this.getDataDirectory();
    const isPackaged = app.isPackaged;

    const backendUrl = `http://127.0.0.1:${this.backendPort}`;
    const alreadyHealthy = await this.waitForHttpHealth(`${backendUrl}/api/v1/health`, 1500);
    if (alreadyHealthy) {
      console.log(`[ProcessManager] Local backend is already active on port ${this.backendPort}.`);
      onProgress?.('Local POS backend is ready.');
      return backendUrl;
    }

    const backendDir = isPackaged
      ? path.join(process.resourcesPath, 'backend')
      : path.resolve(__dirname, '..', '..', '..', 'backend');

    const backendEntry = path.join(backendDir, 'dist', 'server.js');

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
      CORS_ORIGIN: `http://127.0.0.1:${this.backendPort},http://localhost:${this.backendPort},http://localhost:5173,http://localhost:8081,https://88.222.242.20:8443`,
      POS_ROLE: 'LOCAL_PRIMARY',
      CLOUD_SYNC_ENABLED: 'true',
      CLOUD_DATABASE_URL: process.env.CLOUD_DATABASE_URL || 'postgresql://neondb_owner:npg_C4W3bIOTtwLK@ep-ancient-fire-a1avc551.ap-southeast-1.aws.neon.tech/isuru_pos?sslmode=require',
      POS_DEVICE_ID: 'pos-main',
    };

    const logFile = path.join(dataDir, 'logs', 'backend.log');
    let logFd: number | 'ignore' = 'ignore';
    try {
      logFd = fs.openSync(logFile, 'a');
    } catch (e) {
      console.warn('[ProcessManager] Could not open backend.log for writing:', e);
    }

    this.backendProcess = spawn(nodeRuntime, [backendEntry], {
      cwd: backendDir,
      env: {
        ...env,
        NODE_PATH: path.join(backendDir, 'node_modules'),
      },
      detached: false,
      stdio: ['ignore', logFd, logFd],
      windowsHide: true,
    });

    this.backendProcess.on('error', (err) => {
      console.error('[ProcessManager] Backend spawn error:', err);
    });

    // Wait for health endpoint
    const ready = await this.waitForHttpHealth(`${backendUrl}/api/v1/health`, 30000);

    if (!ready) {
      let logTail = '';
      try {
        if (fs.existsSync(logFile)) {
          const logContent = fs.readFileSync(logFile, 'utf8');
          logTail = logContent.slice(-1500).trim();
        }
      } catch {}
      throw new Error(
        `Local backend failed to report healthy at ${backendUrl}/api/v1/health.${
          logTail ? `\n\nBackend Output Log:\n${logTail}` : ''
        }`
      );
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
