import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { describe, it, before, after, beforeEach } from 'node:test';

import { db } from '../db/connection';
import { KnexRefreshTokenRepository } from '../repositories/refresh-token.repository';
import { KnexUserRepository } from '../repositories/user.repository';

import { AuthService, type OAuthProfile } from './auth.service';
import { JwtService } from './jwt.service';

describe('AuthService Integration Test (Real DB + Real JwtService + Real SHA-256 Hashing)', () => {
  let userRepo: KnexUserRepository;
  let tokenRepo: KnexRefreshTokenRepository;
  let jwtService: JwtService;
  let authService: AuthService;

  const testProfile: OAuthProfile = {
    provider: 'google',
    providerId: 'real_oauth_id_9999',
    name: 'Real Integration User',
    email: 'integration.user@drara.io',
    avatarUrl: 'https://example.com/real-avatar.jpg',
  };

  before(async () => {
    // Verify DB connection
    await db.raw('SELECT 1');

    userRepo = new KnexUserRepository(db);
    tokenRepo = new KnexRefreshTokenRepository(db);
    jwtService = new JwtService(); // Real RS256 + Real SHA-256 hashing
    authService = new AuthService(userRepo, tokenRepo, jwtService);
  });

  beforeEach(async () => {
    // Clean up test database tables before each test run
    await db('refresh_tokens').del();
    await db('users').where({ email: testProfile.email }).del();
  });

  after(async () => {
    // Clean up after suite
    await db('refresh_tokens').del();
    await db('users').where({ email: testProfile.email }).del();
  });

  it('end-to-end OAuth login -> SHA-256 hashed DB save -> raw token refresh -> DB lookup & rotation', async () => {
    // 1. Perform OAuth login (creates user in Postgres + saves hashed refresh token in Postgres)
    const { user, tokens } = await authService.loginWithOAuth(testProfile);

    assert.ok(user.id, 'User must have a generated UUID in Postgres');
    assert.equal(user.email, testProfile.email);
    assert.ok(tokens.accessToken, 'Access token must be generated');
    assert.ok(tokens.refreshToken, 'Raw refresh token must be returned');

    // 2. Verify SHA-256 hashing in Postgres DB
    const expectedSha256Hash = createHash('sha256').update(tokens.refreshToken).digest('hex');
    assert.equal(tokens.refreshTokenHash, expectedSha256Hash, 'Token hash must match SHA-256 of raw refresh token');

    const dbTokenRecord = await tokenRepo.findByHash(expectedSha256Hash);
    assert.ok(dbTokenRecord, 'Token record must exist in PostgreSQL database under SHA-256 hash key');
    assert.equal(dbTokenRecord.user_id, user.id);
    assert.equal(dbTokenRecord.revoked_at, null, 'New token must not be revoked');

    // 3. Perform Token Refresh using RAW refresh token (tests real JwtService.hashToken + DB query)
    const newTokens = await authService.refreshTokens(tokens.refreshToken);

    assert.ok(newTokens.accessToken, 'New access token must be generated');
    assert.ok(newTokens.refreshToken, 'New refresh token must be generated');
    assert.notEqual(newTokens.refreshToken, tokens.refreshToken, 'New refresh token must differ from old token');

    // 4. Verify old token is REVOKED in Postgres DB
    const revokedOldToken = await tokenRepo.findByHash(expectedSha256Hash);
    assert.ok(revokedOldToken?.revoked_at instanceof Date, 'Old token record in PostgreSQL must have revoked_at timestamp set');

    // 5. Verify new token is ACTIVE in Postgres DB
    const newExpectedSha256Hash = createHash('sha256').update(newTokens.refreshToken).digest('hex');
    const dbNewTokenRecord = await tokenRepo.findByHash(newExpectedSha256Hash);
    assert.ok(dbNewTokenRecord, 'New token record must exist in PostgreSQL database');
    assert.equal(dbNewTokenRecord.revoked_at, null, 'New token in Postgres must be active');
  });
});
