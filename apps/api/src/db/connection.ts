import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import knex from 'knex';

import { logger } from '../lib/logger';

export const db = knex({
  client: 'pg',
  connection: {
    host: process.env['DB_HOST'] ?? 'localhost',
    port: Number(process.env['DB_PORT'] ?? 5432),
    database: process.env['DB_NAME'] ?? 'drara_dev',
    user: process.env['DB_USER'] ?? 'drara',
    password: process.env['DB_PASSWORD'] ?? '',
  },
  pool: {
    min: Number(process.env['DB_POOL_MIN'] ?? 2),
    max: Number(process.env['DB_POOL_MAX'] ?? 10),
    afterCreate: (conn: { query: (sql: string, cb: (err: unknown) => void) => void }, done: (err: unknown, conn: unknown) => void) => {
      conn.query('SET timezone="UTC"', (err) => {
        done(err, conn);
      });
    },
  },
  acquireConnectionTimeout: 10000,
  log: {
    warn(message: string) { logger.warn(message); },
    error(message: string) { logger.error(message); },
    deprecate(message: string) { logger.warn(message); },
    debug(message: string) { logger.debug(message); },
  },
});
