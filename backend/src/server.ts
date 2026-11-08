import { app } from './app.js';
import { connectDB, disconnectDB } from './config/database.js';
import { ENV } from './config/env.js';
import { bootstrapAdminIfNeeded } from './modules/auth/auth.controller.js';
import { startSyncWorker, stopSyncWorker } from './services/sync-worker.service.js';

async function startServer() {
  await connectDB();
  await bootstrapAdminIfNeeded();

  const server = app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`  ISURU Service Center API Server running on port ${ENV.PORT}`);
    console.log(`  Environment: ${ENV.NODE_ENV}`);
    console.log(`  Role: ${ENV.POS_ROLE}`);
    console.log(`  Health Check: http://localhost:${ENV.PORT}/api/v1/health`);
    console.log(`====================================================`);

    // Start background sync worker if running as local POS terminal
    if (ENV.POS_ROLE === 'LOCAL_PRIMARY' && ENV.CLOUD_SYNC_ENABLED) {
      startSyncWorker();
    }
  });

  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    stopSyncWorker();
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
