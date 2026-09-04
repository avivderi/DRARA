import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

import { FakeIdeaRepository } from '../repositories/idea.repository.fake';
import { FakeUserRepository } from '../repositories/user.repository.fake';

import type { AIServiceClient } from './ai-service.client';
import { MatchingService } from './matching.service';

describe('MatchingService Unit Tests', () => {
  let ideaRepo: FakeIdeaRepository;
  let userRepo: FakeUserRepository;
  let fakeAiClient: AIServiceClient;
  let matchingService: MatchingService;

  beforeEach(() => {
    ideaRepo = new FakeIdeaRepository();
    userRepo = new FakeUserRepository();
    fakeAiClient = {
      generateEmbedding: async () => [0.1, 0.2, 0.3],
    } as unknown as AIServiceClient;

    matchingService = new MatchingService(ideaRepo, userRepo, fakeAiClient);
  });

  it('enforces visibility rules — returns empty matches array if non-owner requests private_ai_recommend idea matches', async () => {
    const owner = await userRepo.create({
      name: 'Owner User',
      email: 'owner@drara.io',
      provider: 'github',
      provider_id: 'p_owner',
    });

    const requester = await userRepo.create({
      name: 'Other User',
      email: 'other@drara.io',
      provider: 'github',
      provider_id: 'p_other',
    });

    const idea = await ideaRepo.create({
      user_id: owner.id,
      title: 'Private AI Startup',
      visibility: 'private_ai_recommend',
    });

    // Owner request -> allowed
    const ownerMatches = await matchingService.getMatchesForIdea(owner.id, idea.id);
    assert.ok(Array.isArray(ownerMatches));

    // Non-owner request -> restricted (empty result)
    const nonOwnerMatches = await matchingService.getMatchesForIdea(requester.id, idea.id);
    assert.equal(nonOwnerMatches.length, 0, 'Non-owner must NOT see matches for private_ai_recommend idea');
  });

  it('returns candidate match with AI rationale for matched skills', async () => {
    const owner = await userRepo.create({
      name: 'Founder',
      email: 'founder@drara.io',
      provider: 'google',
      provider_id: 'p_founder',
    });

    const candidateUser = await userRepo.create({
      name: 'Tech Candidate',
      email: 'candidate@drara.io',
      provider: 'github',
      provider_id: 'p_cand',
    });

    await userRepo.update(candidateUser.id, {
      offering_tags: ['Backend', 'DevOps'],
      offering_embedding: [0.1, 0.2, 0.3],
    });

    const idea = await ideaRepo.create({
      user_id: owner.id,
      title: 'Cloud Orchestrator',
      visibility: 'public',
    });
    await ideaRepo.updateSeekingEmbedding(idea.id, ['Backend', 'DevOps'], [0.1, 0.2, 0.3]);

    const matches = await matchingService.getMatchesForIdea(owner.id, idea.id);
    const match = matches[0];
    assert.ok(match);
    assert.equal(match.candidate.id, candidateUser.id);
    assert.ok(match.similarityScore > 0.99);
    assert.ok(match.aiRationale.includes('Strong technical match'));
  });
});
