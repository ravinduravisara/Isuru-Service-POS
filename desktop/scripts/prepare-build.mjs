// ==============================================================================
// ISURU SERVICE CENTER POS: PREPARE DESKTOP BUILD
// ==============================================================================
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

console.log('====================================================');
console.log('  ISURU POS: PREPARING WINDOWS DESKTOP PACKAGE BUILD');
console.log('====================================================');

// 1. Build backend if needed
const backendDist = path.join(projectRoot, 'backend', 'dist');
if (!fs.existsSync(backendDist) || !fs.existsSync(path.join(backendDist, 'server.js'))) {
  console.log('-> Compiling Express Backend TypeScript...');
  execSync('npm run build', { cwd: path.join(projectRoot, 'backend'), stdio: 'inherit' });
} else {
  console.log('✔ Backend dist found.');
}

// 2. Build frontend if needed
const frontendDist = path.join(projectRoot, 'frontend', 'dist');
if (!fs.existsSync(frontendDist) || !fs.existsSync(path.join(frontendDist, 'index.html'))) {
  console.log('-> Compiling React Frontend Assets (Vite)...');
  execSync('npm run build', { cwd: path.join(projectRoot, 'frontend'), stdio: 'inherit' });
} else {
  console.log('✔ Frontend dist found.');
}

// 3. Ensure Windows Prisma engines are available
console.log('-> Generating Prisma Client with native Windows target support...');
try {
  execSync('npx prisma generate', { cwd: path.join(projectRoot, 'backend'), stdio: 'inherit' });
  console.log('✔ Prisma client ready.');
} catch (err) {
  console.warn('⚠ Note on Prisma generate:', err.message);
}

// 4. Ensure placeholder pgsql directory exists if not yet populated
const pgsqlDir = path.join(__dirname, '..', 'windows', 'postgres', 'pgsql');
if (!fs.existsSync(pgsqlDir)) {
  fs.mkdirSync(pgsqlDir, { recursive: true });
}

console.log('====================================================');
console.log('✔ Pre-build preparation completed.');
console.log('====================================================');
