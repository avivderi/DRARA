import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../lib/errors';
import type { User } from '../repositories/user.repository.interface';
import { jwtService } from '../services/jwt.service';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    throw AppError.unauthorized('Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwtService.verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    throw AppError.unauthorized('Access token invalid or expired');
  }
}
