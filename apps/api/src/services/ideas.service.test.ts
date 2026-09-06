import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

import { FakeConnectedRepoRepository } from '../repositories/connected-repo.repository.fake';
import { FakeIdeaRepository } from '../repositories/idea.repository.fake';

import type { AIScanRequestPayload, AIScanResponsePayload } from './ai-service.client';
import { IdeasService } from './ideas.service';

// Mock AIServiceClient for unit tests
class MockAIServiceClient {
  public scanCallCount = 0;

  async scanRepository(payload: AIScanRequestPayload): Promise<AIScanResponsePayload> {
    this.scanCallCount++;
    return {
      ai_summary: `Mock AI summary for ${payload.github_repo_full_name}`,
      stack_detected: ['TypeScript', 'FastAPI'],
      readiness_score: 8,
      readiness_rationale: 'Well structured monorepo.',
      tokens_used: 250,
      estimated_cost_usd: 0.0008,
    };
  }
}

describe('IdeasService Unit Tests', () => {
  let ideaRepo: FakeIdeaRepository;
  let connectedRepoRepo: FakeConnectedRepoRepository;
  let mockAiClient: MockAIServiceClient;
  let ideasService: IdeasService;

  beforeEach(() => {
    ideaRepo = new FakeIdeaRepository();
    connectedRepoRepo = new FakeConnectedRepoRepository();
    mockAiClient = new MockAIServiceClient();
    ideasService = new IdeasService(ideaRepo, connectedRepoRepo, mockAiClient as any);
    process.env['GITHUB_AI_SCAN_ENABLED'] = 'true';
    process.env['MAX_SCANS_PER_DAY'] = '5';
  });

  it('createIdea creates a new idea', async () => {
    const idea = await ideasService.createIdea('user_1', 'DRARA Startup', 'Co-Founder Platform');
    assert.ok(idea.id);
    assert.equal(idea.title, 'DRARA Startup');
    assert.equal(idea.visibility, 'private_ai_recommend');
  });

  it('connectRepo links GitHub repository to idea', async () => {
    const idea = await ideasService.createIdea('user_1', 'My App');
    const repo = await ideasService.connectRepo('user_1', idea.id, 'avivderi/DRARA', 'inst_999');

    assert.ok(repo.id);
    assert.equal(repo.idea_id, idea.id);
    assert.equal(repo.github_repo_full_name, 'avivderi/DRARA');
  });

  it('scanIdea invokes AI client and updates scan result in idea repo', async () => {
    const idea = await ideasService.createIdea('user_1', 'AI App');
    await ideasService.connectRepo('user_1', idea.id, 'avivderi/DRARA', 'inst_999');

    const scanned = await ideasService.scanIdea('user_1', idea.id, true);

    assert.ok(scanned.ai_summary.includes('DRARA'));
    assert.deepEqual(scanned.stack_detected, ['TypeScript', 'FastAPI']);
    assert.equal(scanned.readiness_score, 8);
    assert.equal(mockAiClient.scanCallCount, 1);
  });

  it('scanIdea throws FEATURE_DISABLED if GITHUB_AI_SCAN_ENABLED is false', async () => {
    process.env['GITHUB_AI_SCAN_ENABLED'] = 'false';
    const idea = await ideasService.createIdea('user_1', 'Disabled AI App');

    await assert.rejects(
      () => ideasService.scanIdea('user_1', idea.id),
      (err: any) => {
        assert.equal(err.code, 'FEATURE_DISABLED');
        return true;
      },
    );
  });

  it('setManualDescription stores text fallback', async () => {
    const idea = await ideasService.createIdea('user_1', 'Manual Pitch App');
    const updated = await ideasService.setManualDescription('user_1', idea.id, 'Handcrafted pitch description');

    assert.equal(updated.manual_description, 'Handcrafted pitch description');
  });

  it('setVisibility enforces public visibility rule: requires ai_summary OR manual_description', async () => {
    const idea = await ideasService.createIdea('user_1', 'Strict App');

    // Attempt setting public without any description -> MUST fail
    await assert.rejects(
      () => ideasService.setVisibility('user_1', idea.id, 'public'),
      (err: any) => {
        assert.equal(err.code, 'DESCRIPTION_REQUIRED_FOR_PUBLIC');
        return true;
      },
    );

    // Provide manual description first
    await ideasService.setManualDescription('user_1', idea.id, 'Now I have a description');

    // Attempt setting public again -> MUST succeed
    const publicIdea = await ideasService.setVisibility('user_1', idea.id, 'public');
    assert.equal(publicIdea.visibility, 'public');
  });
});
