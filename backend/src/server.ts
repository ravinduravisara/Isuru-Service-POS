import { app } from './app.js';
import { connectDB } from './config/database.js';
import { ENV } from './config/env.js';

async function startServer() {
  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`  ISURU Service Center API Server running on port ${ENV.PORT}`);
    console.log(`  Environment: ${ENV.NODE_ENV}`);
    console.log(`  Health Check: http://localhost:${ENV.PORT}/api/v1/health`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
