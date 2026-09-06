import type { Request, Response } from 'express';

import { db } from '../db/connection';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { KnexRefreshTokenRepository } from '../repositories/refresh-token.repository';
import { KnexUserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { jwtService } from '../services/jwt.service';

// Composition root — wire up dependencies
function makeAuthService(): AuthService {
  return new AuthService(
    new KnexUserRepository(db),
    new KnexRefreshTokenRepository(db),
    jwtService,
  );
}

export const authController = {
  /** Called by Passport after successful Google/GitHub OAuth */
  oauthCallback: async (req: Request, res: Response): Promise<void> => {
    // At this point, req.user is populated by Passport with OAuthProfile
    const profile = req.user as Parameters<AuthService['loginWithOAuth']>[0];
    if (!profile) throw AppError.internal('OAuth profile missing after callback');

    const authService = makeAuthService();
    const { tokens } = await authService.loginWithOAuth(profile);

    const redirectUri = (req.query['state'] as string | undefined) || (req.query['redirect_uri'] as string | undefined);

    if (redirectUri && (redirectUri.startsWith('drara://') || redirectUri.startsWith('exp://') || redirectUri.startsWith('http://') || redirectUri.startsWith('https://'))) {
      const separator = redirectUri.includes('?') ? '&' : '?';
      res.redirect(`${redirectUri}${separator}access_token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`);
      return;
    }

    // Return tokens — client stores refresh token in secure storage
    res.json({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: tokens.refreshTokenExpiresAt,
    });
  },

  refresh: async (req: Request, res: Response): Promise<void> => {
    const { refresh_token } = req.body as { refresh_token?: string };
    if (!refresh_token) throw AppError.badRequest('refresh_token is required');

    const authService = makeAuthService();
    const tokens = await authService.refreshTokens(refresh_token);

    res.json({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: tokens.refreshTokenExpiresAt,
    });
  },

  logout: async (req: Request, res: Response): Promise<void> => {
    const { refresh_token } = req.body as { refresh_token?: string };
    if (!refresh_token) throw AppError.badRequest('refresh_token is required');

    const authService = makeAuthService();
    await authService.logout(refresh_token);

    res.status(204).send();
  },

  demoLogin: async (req: Request, res: Response): Promise<void> => {
    if (process.env['NODE_ENV'] === 'production') {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    logger.warn('⚠️ DEMO AUTH USED - NOT REAL OAUTH');

    const { email, name, provider = 'google' } = req.body as { email?: string; name?: string; provider?: 'google' | 'github' };
    const userEmail = email || `founder_${Date.now()}@drara.io`;
    const userName = name || 'אלון מזרחי';
    const authService = makeAuthService();
    const { tokens, user } = await authService.loginWithOAuth({
      provider,
      providerId: `demo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: userName,
      email: userEmail,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    res.json({
      user,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: tokens.refreshTokenExpiresAt,
    });
  },

};

