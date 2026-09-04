import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

import { FakeRefreshTokenRepository } from '../repositories/refresh-token.repository.fake';

describe('FakeRefreshTokenRepository', () => {
  let repo: FakeRefreshTokenRepository;

  const makeToken = (userId = 'user-1', overrides: Partial<{ expires_at: Date }> = {}) => ({
    user_id: userId,
    token_hash: `hash_${Math.random()}`,
    expires_at: overrides.expires_at ?? new Date(Date.now() + 86400_000), // 1 day
  });

  beforeEach(() => {
    repo = new FakeRefreshTokenRepository();
  });

  it('creates and returns a token', async () => {
    const input = makeToken();
    const token = await repo.create(input);

    assert.ok(token.id);
    assert.equal(token.token_hash, input.token_hash);
    assert.equal(token.revoked_at, null);
  });

  it('findByHash returns the token', async () => {
    const input = makeToken();
    await repo.create(input);

    const found = await repo.findByHash(input.token_hash);
    assert.ok(found);
    assert.equal(found.token_hash, input.token_hash);
  });

  it('findByHash returns null for unknown hash', async () => {
    const found = await repo.findByHash('no-such-hash');
    assert.equal(found, null);
  });

  it('revoke sets revoked_at timestamp', async () => {
    const input = makeToken();
    await repo.create(input);
    await repo.revoke(input.token_hash);

    const token = await repo.findByHash(input.token_hash);
    assert.ok(token?.revoked_at instanceof Date);
  });

  it('revokeAllForUser revokes only that user tokens', async () => {
    const t1 = makeToken('user-A');
    const t2 = makeToken('user-A');
    const t3 = makeToken('user-B');

    await repo.create(t1);
    await repo.create(t2);
    await repo.create(t3);

    await repo.revokeAllForUser('user-A');

    const found1 = await repo.findByHash(t1.token_hash);
    const found2 = await repo.findByHash(t2.token_hash);
    const found3 = await repo.findByHash(t3.token_hash);

    assert.ok(found1?.revoked_at, 'user-A token 1 should be revoked');
    assert.ok(found2?.revoked_at, 'user-A token 2 should be revoked');
    assert.equal(found3?.revoked_at, null, 'user-B token should NOT be revoked');
  });

  it('deleteExpired removes only expired tokens and returns count', async () => {
    const expired = makeToken('user-1', { expires_at: new Date(Date.now() - 1000) });
    const active = makeToken('user-1');

    await repo.create(expired);
    await repo.create(active);

    const deleted = await repo.deleteExpired();
    assert.equal(deleted, 1);

    const foundExpired = await repo.findByHash(expired.token_hash);
    const foundActive = await repo.findByHash(active.token_hash);

    assert.equal(foundExpired, null);
    assert.ok(foundActive);
  });
});
