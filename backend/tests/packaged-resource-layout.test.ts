import { describe, it, expect, afterAll } from 'vitest';
import path from 'path';
import fs from 'fs';
import { spawn, ChildProcess } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');

describe('Packaged Windows Resource Layout & ES Module Execution Test', () => {
  let backendProc: ChildProcess | null = null;
  const mockResourceDir = path.join(backendRoot, '.tmp-mock-resources');

  afterAll(async () => {
    if (backendProc && !backendProc.killed) {
      backendProc.kill('SIGTERM');
    }
    // Clean up temporary mock resource directory
    try {
      if (fs.existsSync(mockResourceDir)) {
        fs.rmSync(mockResourceDir, { recursive: true, force: true });
      }
    } catch {}
  });

  it('should verify backend/dist/package.json exists with type=module', () => {
    const distPkgPath = path.join(backendRoot, 'dist', 'package.json');
    expect(fs.existsSync(distPkgPath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(distPkgPath, 'utf8'));
    expect(content.type).toBe('module');
  });

  it('should successfully execute ES module application from a simulated packaged resource layout', async () => {
    // 1. Build simulated packaged directory structure matching Electron extraResources:
    //    mock-resources/
    //      backend/
    //        package.json
    //        dist/
    //          package.json
    //          server.js, app.js, ...
    //        node_modules -> symlinked
    //        prisma -> symlinked
    const mockBackend = path.join(mockResourceDir, 'backend');
    const mockDist = path.join(mockBackend, 'dist');
    fs.mkdirSync(mockDist, { recursive: true });

    // Copy backend/package.json
    fs.copyFileSync(
      path.join(backendRoot, 'package.json'),
      path.join(mockBackend, 'package.json')
    );

    // Copy backend/dist
    const distFiles = fs.readdirSync(path.join(backendRoot, 'dist'));
    for (const f of distFiles) {
      const src = path.join(backendRoot, 'dist', f);
      const dest = path.join(mockDist, f);
      if (fs.statSync(src).isDirectory()) {
        fs.cpSync(src, dest, { recursive: true });
      } else {
        fs.copyFileSync(src, dest);
      }
    }

    // Link node_modules and prisma
    try {
      fs.symlinkSync(path.join(backendRoot, 'node_modules'), path.join(mockBackend, 'node_modules'), 'junction');
      fs.symlinkSync(path.join(backendRoot, 'prisma'), path.join(mockBackend, 'prisma'), 'junction');
    } catch {
      // Fallback if symlinks restricted
    }

    // 2. Write a runner script that tests importing compiled dist/app.js (exact ESM import like server.js)
    const runnerScript = path.join(mockBackend, 'test-runner.mjs');
    const runnerContent = `
import { app } from './dist/app.js';
console.log('ESM_IMPORT_SUCCESS: app loaded as ' + typeof app);
process.exit(0);
`;
    fs.writeFileSync(runnerScript, runnerContent, 'utf8');

    // 3. Spawn child node process from mock packaged directory
    let stdoutData = '';
    let stderrData = '';

    const processExitPromise = new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve) => {
      backendProc = spawn(process.execPath, [runnerScript], {
        cwd: mockBackend,
        env: {
          ...process.env,
          NODE_ENV: 'test',
          JWT_SECRET: 'test_secret_for_packaged_resource_layout_test_minimum_32_chars!',
          POS_ROLE: 'LOCAL_PRIMARY',
          CLOUD_SYNC_ENABLED: 'false',
          NODE_PATH: path.join(backendRoot, 'node_modules'),
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      backendProc.stdout?.on('data', (c) => (stdoutData += c.toString()));
      backendProc.stderr?.on('data', (c) => (stderrData += c.toString()));
      backendProc.on('exit', (code) => {
        resolve({ code, stdout: stdoutData, stderr: stderrData });
      });
      backendProc.on('error', (err) => {
        resolve({ code: -1, stdout: stdoutData, stderr: err.message });
      });

      setTimeout(() => {
        backendProc?.kill('SIGKILL');
        resolve({ code: -2, stdout: stdoutData, stderr: 'Timeout waiting for child process' });
      }, 8000);
    });

    const result = await processExitPromise;
    if (result.code !== 0) {
      console.error('Child process failed to exit cleanly in mock packaged layout.');
      console.error('STDOUT:', result.stdout);
      console.error('STDERR:', result.stderr);
    }
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('ESM_IMPORT_SUCCESS: app loaded as function');

    // 4. Verify in-memory route execution of /api/v1/health using native Express dispatcher
    const appModuleUrl = pathToFileURL(path.join(mockDist, 'app.js')).href;
    const { app: importedApp } = await import(appModuleUrl);

    let responseBody: any = null;
    let statusCode = 0;

    await new Promise<void>((resolve, reject) => {
      const mockReq = {
        method: 'GET',
        url: '/api/v1/health',
        headers: { host: '127.0.0.1' },
      };
      const mockRes = {
        statusCode: 200,
        setHeader() { return this; },
        getHeader() { return ''; },
        status(c: number) { statusCode = c; return this; },
        json(data: any) {
          statusCode = statusCode || 200;
          responseBody = data;
          resolve();
        },
        send(data: any) {
          statusCode = statusCode || 200;
          try { responseBody = JSON.parse(data); } catch { responseBody = data; }
          resolve();
        },
        end() { resolve(); },
      };

      try {
        importedApp.handle(mockReq, mockRes, (err: any) => {
          if (err) reject(err);
          else resolve();
        });
      } catch (e) {
        reject(e);
      }
    });

    expect(statusCode).toBe(200);
    expect(responseBody).toBeDefined();
    expect(responseBody.status).toBe('ok');
    expect(responseBody.service).toBe('ISURU Service Center API');
  }, 15000);

  it('should authorize loopback CORS requests with Origin: http://127.0.0.1:5050 in production mode', async () => {
    const { app: importedApp } = await import(pathToFileURL(path.join(mockResourceDir, 'backend', 'dist', 'app.js')).href);

    let statusCode = 0;
    let responseBody: any = null;
    const resHeaders: Record<string, string> = {};

    await new Promise<void>((resolve, reject) => {
      const mockReq = {
        method: 'GET',
        url: '/api/v1/health',
        headers: {
          host: '127.0.0.1:5050',
          origin: 'http://127.0.0.1:5050',
        },
      };
      const mockRes = {
        statusCode: 200,
        setHeader(name: string, value: string) {
          resHeaders[name.toLowerCase()] = value;
          return this;
        },
        getHeader(name: string) { return resHeaders[name.toLowerCase()] || ''; },
        status(c: number) { statusCode = c; return this; },
        json(data: any) {
          statusCode = statusCode || 200;
          responseBody = data;
          resolve();
        },
        send(data: any) {
          statusCode = statusCode || 200;
          try { responseBody = JSON.parse(data); } catch { responseBody = data; }
          resolve();
        },
        end() { resolve(); },
      };

      try {
        importedApp.handle(mockReq, mockRes, (err: any) => {
          if (err) reject(err);
          else resolve();
        });
      } catch (e) {
        reject(e);
      }
    });

    expect(statusCode).toBe(200);
    expect(responseBody).toBeDefined();
    expect(responseBody.status).toBe('ok');
    expect(resHeaders['access-control-allow-origin']).toBe('http://127.0.0.1:5050');
  });
});
