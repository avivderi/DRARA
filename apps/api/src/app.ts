import cors from 'cors';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';

import { logger } from './lib/logger';
import { authRouter } from './routes/auth.routes';
import { githubRouter } from './routes/github.routes';
import { ideasRouter } from './routes/ideas.routes';
import { sessionRouter } from './routes/session.routes';
import { usersRouter } from './routes/users.routes';
import { AppError } from './lib/errors';

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

  // ── Request logging ──────────────────────────────────────
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info({ method: req.method, path: req.path }, 'Incoming request');
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
