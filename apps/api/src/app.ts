import cors from 'cors';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';

import { db } from './db/connection';
import { AppError } from './lib/errors';
import { logger } from './lib/logger';
import { authRouter } from './routes/auth.routes';
import { createConversationsRouter } from './routes/conversations.routes';
import { githubRouter } from './routes/github.routes';
import { handshakeRouter } from './routes/handshake.routes';
import { ideasRouter } from './routes/ideas.routes';
import { matchingRouter } from './routes/matching.routes';
import { createNotificationsRouter } from './routes/notifications.routes';
import { sessionRouter } from './routes/session.routes';
import { usersRouter } from './routes/users.routes';
import { createWorkspacesRouter } from './routes/workspaces.routes';

import fs from 'fs';
import path from 'path';

const logsDir = path.resolve(__dirname, '../../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
const requestLogPath = path.join(logsDir, 'requests.log');

function sanitizeBody(body: unknown): string {
  if (!body || typeof body !== 'object') return '';
  const copy = { ...(body as Record<string, unknown>) };
  for (const key of ['password', 'access_token', 'refresh_token', 'token', 'client_secret']) {
    if (key in copy) copy[key] = '[REDACTED]';
  }
  return JSON.stringify(copy);
}

export function createApp(): Application {
  const app = express();

  // ── Security middleware ──────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000',
      credentials: true,
    }),
  );

  // ── Body parsing ─────────────────────────────────────────
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));

  // ── Request logging to requests.log ──────────────────────
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    res.on('finish', () => {
      const duration = Date.now() - start;
      const timestamp = new Date().toISOString();
      const logLine = `[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${clientIp} - Status: ${res.statusCode} (${duration}ms) - Body: ${sanitizeBody(req.body)}\n`;

      fs.appendFile(requestLogPath, logLine, () => {});
      logger.info({ method: req.method, path: req.originalUrl, status: res.statusCode, duration }, 'Incoming request');
    });

    next();
  });

  // ── Routes ───────────────────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'drara-api', timestamp: new Date().toISOString() });
  });

  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/session', sessionRouter);
  app.use('/ideas', ideasRouter);
  app.use('/github', githubRouter);
  app.use('/handshake', handshakeRouter);
  app.use('/conversations', createConversationsRouter(db));
  app.use('/notifications', createNotificationsRouter(db));
  app.use('/workspaces', createWorkspacesRouter(db));
  app.use('/', matchingRouter);

  // ── 404 handler ──────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // ── Global error handler ─────────────────────────────────
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      logger.warn({ err, statusCode: err.statusCode }, 'Application error');
      res.status(err.statusCode).json({ error: err.message, code: err.code });
      return;
    }

    logger.error({ err }, 'Unhandled error');
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
