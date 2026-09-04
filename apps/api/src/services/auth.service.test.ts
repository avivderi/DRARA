import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

import { FakeRefreshTokenRepository } from '../repositories/refresh-token.repository.fake';
import { FakeUserRepository } from '../repositories/user.repository.fake';

import { AuthService } from './auth.service';
import type { OAuthProfile } from './auth.service';
import { jwtService } from './jwt.service';

// NOTE: JwtService reads key files from disk.
// For unit tests, we use a minimal test double where:
// - The raw refresh token IS the hash key (identity hash)
// - This ensures hashToken(rawRefreshToken) == refreshTokenHash stored in repo
const fakeJwt = {
  generateTokenPair: (_userId: string, _email: string) => {
    const rawToken = `raw_refresh_${Math.random()}`;
    return {
      accessToken: `fake_access_token`,
      refreshToken: rawToken,
      refreshTokenHash: rawToken, // identity: hash == raw for test simplicity
      refreshTokenExpiresAt: new Date(Date.now() + 86400_000),
    };
  },
  hashToken: (raw: string) => raw, // identity hash in tests
} as unknown as typeof jwtService;

describe('AuthService', () => {
  let userRepo: FakeUserRepository;
  let tokenRepo: FakeRefreshTokenRepository;
  let authService: AuthService;

  const googleProfile: OAuthProfile = {
    provider: 'google',
    providerId: 'google_123',
    name: 'Aviv Deri',
    email: 'aviv@drara.io',
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    userRepo = new FakeUserRepository();
    tokenRepo = new FakeRefreshTokenRepository();
    authService = new AuthService(userRepo, tokenRepo, fakeJwt);
  });

  describe('loginWithOAuth', () => {
    it('creates a new user on first login', async () => {
      const { user, tokens } = await authService.loginWithOAuth(googleProfile);

      assert.equal(user.email, googleProfile.email);
      assert.equal(user.provider, 'google');
      assert.ok(tokens.accessToken);
      assert.ok(tokens.refreshToken);
      assert.equal(userRepo.all().length, 1);
    });

    it('returns existing user on subsequent login', async () => {
      await authService.loginWithOAuth(googleProfile);
      await authService.loginWithOAuth(googleProfile);

      assert.equal(userRepo.all().length, 1, 'should not duplicate user');
    });

    it('throws CONFLICT if email is registered with different provider', async () => {
      // First login via Google
      await authService.loginWithOAuth(googleProfile);

      // Try GitHub with same email
      const githubProfile: OAuthProfile = {
        ...googleProfile,
        provider: 'github',
        providerId: 'gh_999',
      };

      await assert.rejects(
        () => authService.loginWithOAuth(githubProfile),
        (err: Error) => {
          assert.ok(err.message.includes('google'));
          return true;
        },
      );
    });

    it('stores refresh token in repository', async () => {
      await authService.loginWithOAuth(googleProfile);
      assert.equal(tokenRepo.all().length, 1);
    });
  });

  describe('refreshTokens', () => {
    it('issues new tokens and revokes old refresh token', async () => {
      const { tokens } = await authService.loginWithOAuth(googleProfile);
      const oldHash = tokens.refreshTokenHash;

      const newTokens = await authService.refreshTokens(tokens.refreshToken);

      assert.ok(newTokens.accessToken);
      assert.notEqual(newTokens.refreshToken, tokens.refreshToken);

      // Old token should be revoked
      const oldToken = await tokenRepo.findByHash(oldHash);
      assert.ok(oldToken?.revoked_at, 'old token should be revoked after rotation');
    });

    it('throws UNAUTHORIZED for non-existent token', async () => {
      await assert.rejects(
        () => authService.refreshTokens('does-not-exist'),
        { message: 'Invalid refresh token' },
      );
    });

    it('throws UNAUTHORIZED for revoked token', async () => {
      const { tokens } = await authService.loginWithOAuth(googleProfile);
      await tokenRepo.revoke(tokens.refreshTokenHash);

      await assert.rejects(
        () => authService.refreshTokens(tokens.refreshToken),
        { message: 'Refresh token revoked' },
      );
    });

    it('throws UNAUTHORIZED for expired token', async () => {
      const { tokens: _tokens } = await authService.loginWithOAuth(googleProfile);
      const stored = tokenRepo.all()[0]!;

      // With identity hash mock: rawToken == tokenHash stored in repo
      // Create a separate token entry that is already expired
      const expiredRawToken = 'expired-raw-token-xyz';
      await tokenRepo.create({
        user_id: stored.user_id,
        token_hash: expiredRawToken, // identity: hash == raw
        expires_at: new Date(Date.now() - 1000), // already expired
      });

      await assert.rejects(
        () => authService.refreshTokens(expiredRawToken),
        { message: 'Refresh token expired' },
      );
    });
  });

  describe('logout', () => {
    it('revokes the refresh token', async () => {
      const { tokens } = await authService.loginWithOAuth(googleProfile);
      await authService.logout(tokens.refreshToken);

      const stored = await tokenRepo.findByHash(tokens.refreshTokenHash);
      assert.ok(stored?.revoked_at, 'token should be revoked after logout');
    });
  });
});
