import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

import { FakeIdeaRepository } from '../repositories/idea.repository.fake';
import { FakeUserRepository } from '../repositories/user.repository.fake';

import { MatchingService } from './matching.service';

describe('MatchingService Unit Tests & Visibility Rules', () => {
  let fakeIdeaRepo: FakeIdeaRepository;
  let fakeUserRepo: FakeUserRepository;
  let matchingService: MatchingService;

  beforeEach(() => {
    fakeIdeaRepo = new FakeIdeaRepository();
    fakeUserRepo = new FakeUserRepository();

    // Pass db mock for unit test (visibility checks occur before DB query)
    matchingService = new MatchingService(
      {} as any,
      fakeIdeaRepo,
      fakeUserRepo,
      { generateEmbedding: async () => new Array(1024).fill(0.1) } as any,
      {} as any,
    );
  });

  it('blocks non-owner from accessing matches of invite_only idea', async () => {
    const owner = await fakeUserRepo.create({
      name: 'Owner Founder',
      email: 'owner@drara.io',
      provider: 'github',
      provider_id: 'owner_123',
    });

    const idea = await fakeIdeaRepo.create({
      user_id: owner.id,
      title: 'Stealth Stealth Startup',
      visibility: 'invite_only',
    });

    await assert.rejects(
      () => matchingService.findMatchesForIdea('unauthorized_user_99', idea.id),
      (err: any) => {
        assert.equal(err.code, 'MATCHES_PRIVATE_TO_OWNER');
        assert.equal(err.statusCode, 403);
        return true;
      },
    );
  });

  it('blocks non-owner from accessing matches of private_ai_recommend idea', async () => {
    const owner = await fakeUserRepo.create({
      name: 'Private Founder',
      email: 'private@drara.io',
      provider: 'github',
      provider_id: 'private_123',
    });

    const idea = await fakeIdeaRepo.create({
      user_id: owner.id,
      title: 'Private Recommendation Startup',
      visibility: 'private_ai_recommend',
    });

    await assert.rejects(
      () => matchingService.findMatchesForIdea('unauthorized_user_99', idea.id),
      (err: any) => {
        assert.equal(err.code, 'MATCHES_PRIVATE_TO_OWNER');
        assert.equal(err.statusCode, 403);
        return true;
      },
    );
  });
});
