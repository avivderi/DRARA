import 'dotenv/config';
import 'express-async-errors';

import { createApp } from './app';
import { db } from './db/connection';
import { logger } from './lib/logger';
import { connectRedis, redis } from './lib/redis';

const PORT = process.env['PORT'] ?? '3001';

async function bootstrap(): Promise<void> {
  // Verify DB connection
  await db.raw('SELECT 1');
  logger.info('PostgreSQL connected');

  // Verify Redis connection
  await connectRedis();
  await redis.ping();
  logger.info('Redis connected');

  const app = createApp();

  app.listen(PORT, () => {
    logger.info({ port: PORT, env: process.env['NODE_ENV'] }, 'DRARA API server started');
  });
}

bootstrap().catch((err: unknown) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
