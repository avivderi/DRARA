import { Router } from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { authController } from '../controllers/auth.controller';
import type { OAuthProfile } from '../services/auth.service';

// ── Passport Strategies ──────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env['GOOGLE_CLIENT_ID'] ?? '',
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] ?? '',
      callbackURL: process.env['GOOGLE_CALLBACK_URL'] ?? '',
    },
    (_accessToken, _refreshToken, profile, done) => {
      const oauthProfile: OAuthProfile = {
        provider: 'google',
        providerId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value ?? '',
        avatarUrl: profile.photos?.[0]?.value ?? null,
      };
      done(null, oauthProfile);
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env['GITHUB_CLIENT_ID'] ?? '',
      clientSecret: process.env['GITHUB_CLIENT_SECRET'] ?? '',
      callbackURL: process.env['GITHUB_CALLBACK_URL'] ?? '',
      scope: ['user:email', 'read:user'],
    },
    (_accessToken: string, _refreshToken: string, profile: { id: string; displayName: string; emails?: { value: string }[]; photos?: { value: string }[]; username?: string }, done: (err: null, user: OAuthProfile) => void) => {
      const oauthProfile: OAuthProfile = {
        provider: 'github',
        providerId: profile.id,
        name: profile.displayName || profile.username || 'GitHub User',
        email: profile.emails?.[0]?.value ?? '',
        avatarUrl: profile.photos?.[0]?.value ?? null,
        githubUsername: profile.username,
      };
      done(null, oauthProfile);
    },
  ),
);

export const authRouter = Router();

// ── Google OAuth ─────────────────────────────────────────
authRouter.get('/google', (req, res, next) => {
  const redirectUri = req.query['redirect_uri'] as string | undefined;
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: redirectUri,
  })(req, res, next);
});

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  authController.oauthCallback,
);

// ── GitHub OAuth ─────────────────────────────────────────
authRouter.get('/github', (req, res, next) => {
  const redirectUri = req.query['redirect_uri'] as string | undefined;
  passport.authenticate('github', {
    scope: ['user:email', 'read:user'],
    session: false,
    state: redirectUri,
  })(req, res, next);
});

authRouter.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/auth/failure' }),
  authController.oauthCallback,
);

// ── Token management ─────────────────────────────────────
authRouter.post('/demo', authController.demoLogin);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);


authRouter.get('/failure', (_req, res) => {
  res.status(401).json({ error: 'OAuth authentication failed' });
});
