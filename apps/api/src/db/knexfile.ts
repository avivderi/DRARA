import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import type { Knex } from 'knex';

export const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env['DB_HOST'] ?? 'localhost',
    port: Number(process.env['DB_PORT'] ?? 5432),
    database: process.env['DB_NAME'] ?? 'drara_dev',
    user: process.env['DB_USER'] ?? 'drara',
    password: process.env['DB_PASSWORD'] ?? '',
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './seeds',
    extension: 'ts',
  },
};

export default config;
