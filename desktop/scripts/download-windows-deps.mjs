// ==============================================================================
// ISURU SERVICE CENTER POS: DOWNLOAD WINDOWS RUNTIME DEPENDENCIES
// ==============================================================================
import path from 'path';
import fs from 'fs';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetPgsqlDir = path.resolve(__dirname, '../windows/postgres/pgsql');

// Official EnterpriseDB / PostgreSQL Windows portable binaries archive
const PG_VERSION = '16.6-1';
const PG_URL = `https://get.enterprisedb.com/postgresql/postgresql-${PG_VERSION}-windows-x64-binaries.zip`;
const TEMP_ZIP = path.resolve(__dirname, `../windows/postgres/temp_postgres_${PG_VERSION}.zip`);

console.log('====================================================');
console.log(`  DOWNLOADING PORTABLE POSTGRESQL ${PG_VERSION} FOR WINDOWS`);
console.log(`  Source: ${PG_URL}`);
console.log('====================================================');

// Helper to download with redirect support
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = (targetUrl) => {
      https.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Download failed with HTTP ${res.statusCode}`));
        }

        const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
        let downloadedBytes = 0;

        res.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          if (totalBytes > 0) {
            const pct = ((downloadedBytes / totalBytes) * 100).toFixed(1);
            process.stdout.write(`\r-> Downloading PostgreSQL binaries: ${pct}% (${(downloadedBytes / 1048576).toFixed(1)} MB)`);
          }
        });

        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('\n✔ Download completed.');
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    };
    get(url);
  });
}

async function main() {
  if (fs.existsSync(path.join(targetPgsqlDir, 'bin', 'postgres.exe'))) {
    console.log('✔ Portable PostgreSQL binaries already extracted.');
    return;
  }

  fs.mkdirSync(path.dirname(targetPgsqlDir), { recursive: true });

  try {
    await downloadFile(PG_URL, TEMP_ZIP);
    console.log('-> Extracting PostgreSQL archive to windows/postgres/...');

    // Extract using tar (standard in Windows 10/11 & macOS)
    execSync(`tar -xf "${TEMP_ZIP}" -C "${path.dirname(targetPgsqlDir)}"`, { stdio: 'inherit' });
    console.log('✔ Extracted successfully.');

    // Prune unneeded GUI management tools and documentation to save ~200MB
    const unneeded = ['pgAdmin 4', 'doc', 'symbols', 'include'];
    for (const folder of unneeded) {
      const p = path.join(targetPgsqlDir, folder);
      if (fs.existsSync(p)) {
        fs.rmSync(p, { recursive: true, force: true });
      }
    }

    if (fs.existsSync(TEMP_ZIP)) {
      fs.unlinkSync(TEMP_ZIP);
    }
  } catch (err) {
    console.warn(`⚠ Warning: Automated download failed: ${err.message}`);
    console.warn('Place extracted "pgsql" folder manually into desktop/windows/postgres/pgsql');
  }
}

main().catch(console.error);
