import { createClient } from 'redis';

import { logger } from './logger';

const client = createClient({
  url: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
});

client.on('error', (err: unknown) => {
  logger.error({ err }, 'Redis client error');
});

export const redis = client;

export async function connectRedis(): Promise<void> {
  if (!client.isOpen) {
    await client.connect();
  }
}

/** Typed wrapper around Redis for QR sessions and future use */
export const redisClient = {
  set: async (key: string, value: string, ttlSeconds: number): Promise<void> => {
    if (!client.isOpen) return;
    await client.setEx(key, ttlSeconds, value);
  },
  get: async (key: string): Promise<string | null> => {
    if (!client.isOpen) return null;
    return client.get(key);
  },
  del: async (key: string): Promise<void> => {
    if (!client.isOpen) return;
    await client.del(key);
  },
  exists: async (key: string): Promise<boolean> => {
    if (!client.isOpen) return false;
    return (await client.exists(key)) === 1;
  },
};
