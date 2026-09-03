import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { FakeIdeaRepository } from './idea.repository.fake';

describe('FakeIdeaRepository', () => {
  let repo: FakeIdeaRepository;

  beforeEach(() => {
    repo = new FakeIdeaRepository();
  });

  it('creates an idea with default visibility private_ai_recommend', async () => {
    const idea = await repo.create({
      user_id: 'user_1',
      title: 'DRARA — AI Co-Founder Platform',
      description: 'Find partners and build startups',
    });

    assert.ok(idea.id);
    assert.equal(idea.user_id, 'user_1');
    assert.equal(idea.title, 'DRARA — AI Co-Founder Platform');
    assert.equal(idea.visibility, 'private_ai_recommend');
    assert.deepEqual(idea.stack_detected, []);
  });

  it('findById returns the created idea', async () => {
    const created = await repo.create({ user_id: 'u1', title: 'Test Idea' });
    const found = await repo.findById(created.id);

    assert.ok(found);
    assert.equal(found.id, created.id);
  });

  it('findByUserId returns all ideas of user ordered', async () => {
    await repo.create({ user_id: 'u1', title: 'Idea 1' });
    await repo.create({ user_id: 'u1', title: 'Idea 2' });
    await repo.create({ user_id: 'u2', title: 'Idea 3' });

    const u1Ideas = await repo.findByUserId('u1');
    assert.equal(u1Ideas.length, 2);
  });

  it('updateScanResult stores AI summary and readiness score', async () => {
    const idea = await repo.create({ user_id: 'u1', title: 'AI Idea' });

    const updated = await repo.updateScanResult(idea.id, {
      ai_summary: 'An autonomous AI agent platform.',
      stack_detected: ['TypeScript', 'Node.js', 'FastAPI'],
      readiness_score: 9,
      readiness_rationale: 'Clean architecture and clear spec.',
    });

    assert.ok(updated);
    assert.equal(updated.ai_summary, 'An autonomous AI agent platform.');
    assert.deepEqual(updated.stack_detected, ['TypeScript', 'Node.js', 'FastAPI']);
    assert.equal(updated.readiness_score, 9);
    assert.ok(updated.last_scanned_at instanceof Date);
  });

  it('updateManualDescription sets manual description', async () => {
    const idea = await repo.create({ user_id: 'u1', title: 'Manual Idea' });

    const updated = await repo.updateManualDescription(idea.id, 'My custom manual pitch text');

    assert.ok(updated);
    assert.equal(updated.manual_description, 'My custom manual pitch text');
  });

  it('updateVisibility updates visibility level', async () => {
    const idea = await repo.create({ user_id: 'u1', title: 'Public Idea' });

    const updated = await repo.updateVisibility(idea.id, 'public');

    assert.ok(updated);
    assert.equal(updated.visibility, 'public');
  });
});
