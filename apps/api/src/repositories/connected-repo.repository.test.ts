import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

import { FakeConnectedRepoRepository } from './connected-repo.repository.fake';

describe('FakeConnectedRepoRepository', () => {
  let repo: FakeConnectedRepoRepository;

  beforeEach(() => {
    repo = new FakeConnectedRepoRepository();
  });

  it('creates and finds connected repo by user and full name', async () => {
    const created = await repo.create({
      user_id: 'u1',
      github_repo_full_name: 'avivderi/DRARA',
      installation_id: 'inst_12345',
    });

    assert.ok(created.id);
    assert.equal(created.github_repo_full_name, 'avivderi/DRARA');

    const found = await repo.findByRepoFullName('u1', 'avivderi/DRARA');
    assert.ok(found);
    assert.equal(found.id, created.id);
  });

  it('linkToIdea connects repo to an idea', async () => {
    const created = await repo.create({
      user_id: 'u1',
      github_repo_full_name: 'avivderi/MakeDev',
      installation_id: 'inst_12345',
    });

    assert.equal(created.idea_id, null);

    const linked = await repo.linkToIdea(created.id, 'idea_abc_123');
    assert.ok(linked);
    assert.equal(linked.idea_id, 'idea_abc_123');

    const foundByIdea = await repo.findByIdeaId('idea_abc_123');
    assert.ok(foundByIdea);
    assert.equal(foundByIdea.id, created.id);
  });

  it('updateLastScanned sets last_scanned_at timestamp', async () => {
    const created = await repo.create({
      user_id: 'u1',
      github_repo_full_name: 'avivderi/DRARA',
      installation_id: 'inst_12345',
    });

    const updated = await repo.updateLastScanned(created.id);
    assert.ok(updated?.last_scanned_at instanceof Date);
  });
});
