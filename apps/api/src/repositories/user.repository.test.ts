import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { FakeUserRepository } from '../repositories/user.repository.fake';

describe('FakeUserRepository', () => {
  let repo: FakeUserRepository;

  beforeEach(() => {
    repo = new FakeUserRepository();
  });

  it('creates a user and returns it with generated id', async () => {
    const user = await repo.create({
      name: 'Aviv Deri',
      email: 'aviv@drara.io',
      avatar_url: null,
      provider: 'github',
      provider_id: 'gh_123',
      githubUsername: 'avivderi',
    });

    assert.ok(user.id, 'should have id');
    assert.equal(user.email, 'aviv@drara.io');
    assert.equal(user.github_username, 'avivderi');
    assert.deepEqual(user.skills, []);
  });

  it('findById returns the user', async () => {
    const created = await repo.create({
      name: 'Test', email: 'test@drara.io', avatar_url: null,
      provider: 'google', provider_id: 'g_1',
    });

    const found = await repo.findById(created.id);
    assert.ok(found);
    assert.equal(found.id, created.id);
  });

  it('findById returns null for unknown id', async () => {
    const found = await repo.findById('non-existent-id');
    assert.equal(found, null);
  });

  it('findByEmail returns the user', async () => {
    await repo.create({
      name: 'Test', email: 'find@drara.io', avatar_url: null,
      provider: 'google', provider_id: 'g_2',
    });

    const found = await repo.findByEmail('find@drara.io');
    assert.ok(found);
    assert.equal(found.email, 'find@drara.io');
  });

  it('findByEmail returns null for unknown email', async () => {
    const found = await repo.findByEmail('nope@drara.io');
    assert.equal(found, null);
  });

  it('findByProvider finds user by provider + providerId', async () => {
    await repo.create({
      name: 'GH User', email: 'gh@drara.io', avatar_url: null,
      provider: 'github', provider_id: 'gh_999',
    });

    const found = await repo.findByProvider('github', 'gh_999');
    assert.ok(found);
    assert.equal(found.provider_id, 'gh_999');
  });

  it('update modifies only provided fields', async () => {
    const user = await repo.create({
      name: 'Original', email: 'orig@drara.io', avatar_url: null,
      provider: 'google', provider_id: 'g_3',
    });

    const updated = await repo.update(user.id, { name: 'Updated', skills: ['TypeScript'] });
    assert.ok(updated);
    assert.equal(updated.name, 'Updated');
    assert.deepEqual(updated.skills, ['TypeScript']);
    assert.equal(updated.email, 'orig@drara.io'); // unchanged
  });

  it('update returns null for unknown id', async () => {
    const result = await repo.update('no-such-id', { name: 'Ghost' });
    assert.equal(result, null);
  });

  it('structuredClone prevents mutation of stored data', async () => {
    const user = await repo.create({
      name: 'Immutable', email: 'i@drara.io', avatar_url: null,
      provider: 'google', provider_id: 'g_4',
    });

    user.name = 'MUTATED'; // mutate returned object
    const refetch = await repo.findById(user.id);
    assert.equal(refetch?.name, 'Immutable'); // store unchanged
  });
});
