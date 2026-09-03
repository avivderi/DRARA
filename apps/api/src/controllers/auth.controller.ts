import type { Request, Response } from 'express';

import { db } from '../db/connection';
import { AppError } from '../lib/errors';
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
};
