import assert from 'node:assert/strict';
import { describe, it, before, after } from 'node:test';

import { db } from '../db/connection';
import { KnexIdeaRepository } from '../repositories/idea.repository';
import { KnexUserRepository } from '../repositories/user.repository';

import { AIServiceClient } from './ai-service.client';
import { MatchingService } from './matching.service';

describe('Module 3 Integration Verification: Real pgvector Matching & Visibility Rules', () => {
  let userRepo: KnexUserRepository;
  let ideaRepo: KnexIdeaRepository;
  let aiClient: AIServiceClient;
  let matchingService: MatchingService;

  let ownerId: string;
  let userA_TechnicalId: string;
  let userB_MarketingId: string;

  before(async () => {
    // 1. Verify PostgreSQL & pgvector connection
    await db.raw('SELECT 1');
    await db.raw('CREATE EXTENSION IF NOT EXISTS vector;');

    userRepo = new KnexUserRepository(db);
    ideaRepo = new KnexIdeaRepository(db);
    aiClient = new AIServiceClient('http://localhost:8000');
    matchingService = new MatchingService(ideaRepo, userRepo, aiClient);

    // Clean up any stale records from previous test runs
    await db('users')
      .whereIn('email', ['founder.module3@drara.io', 'usera.tech@drara.io', 'userb.marketing@drara.io'])
      .del();

    // 2. Create test users
    const owner = await userRepo.create({
      name: 'Startup Founder',
      email: 'founder.module3@drara.io',
      provider: 'github',
      provider_id: 'gh_m3_owner_100',
    });
    ownerId = owner.id;

    const userA = await userRepo.create({
      name: 'User A (Backend & DevOps)',
      email: 'usera.tech@drara.io',
      provider: 'github',
      provider_id: 'gh_m3_usera_101',
    });
    userA_TechnicalId = userA.id;

    const userB = await userRepo.create({
      name: 'User B (Marketing & Sales)',
      email: 'userb.marketing@drara.io',
      provider: 'github',
      provider_id: 'gh_m3_userb_102',
    });
    userB_MarketingId = userB.id;

    // 3. Generate embeddings via /embed service
    const embA = await aiClient.generateEmbedding({
      tags: ['Backend', 'DevOps', 'AWS'],
      bio: 'Senior Cloud Infrastructure Engineer with Go, Python, and Kubernetes expert skills.',
      input_type: 'document',
    });

    const embB = await aiClient.generateEmbedding({
      tags: ['Marketing', 'Sales', 'Content'],
      bio: 'Growth Marketer, SEO Specialist, Brand Manager, and Sales Strategist.',
      input_type: 'document',
    });

    // 4. Save offering_embedding vectors to Real Postgres DB
    await userRepo.update(userA_TechnicalId, {
      offering_tags: ['Backend', 'DevOps', 'AWS'],
      offering_embedding: embA,
    });

    await userRepo.update(userB_MarketingId, {
      offering_tags: ['Marketing', 'Sales', 'Content'],
      offering_embedding: embB,
    });
  });

  after(async () => {
    // Cleanup DB records after test suite
    if (ownerId) await db('ideas').where({ user_id: ownerId }).del();
    if (ownerId) await db('users').where({ id: ownerId }).del();
    if (userA_TechnicalId) await db('users').where({ id: userA_TechnicalId }).del();
    if (userB_MarketingId) await db('users').where({ id: userB_MarketingId }).del();
  });

  it('DoD Requirement 3: Real pgvector Cosine Distance — User A (Technical) ranks significantly higher than User B (Marketing) for Backend/DevOps idea', async () => {
    try {
      // Create an Idea seeking Backend & DevOps
      const idea = await ideaRepo.create({
        user_id: ownerId,
        title: 'Distributed Cloud Microservices Platform',
        description: 'High throughput cloud infrastructure platform needing Backend & DevOps co-founder.',
        visibility: 'public',
      });

      // Generate seeking_embedding vector
      const seekingEmb = await aiClient.generateEmbedding({
        tags: ['Backend', 'DevOps'],
        text: 'Distributed Cloud Microservices Platform | High throughput cloud infrastructure platform needing Backend & DevOps co-founder.',
        input_type: 'query',
      });
      await ideaRepo.updateSeekingEmbedding(idea.id, ['Backend', 'DevOps'], seekingEmb);

      // Query matches from Real PostgreSQL using pgvector <=> operator
      const matches = await matchingService.getMatchesForIdea(ownerId, idea.id, 10);

      assert.ok(matches.length >= 2, 'Must return candidates for both users');

      const matchUserA = matches.find((m) => m.candidate.id === userA_TechnicalId);
      const matchUserB = matches.find((m) => m.candidate.id === userB_MarketingId);

      assert.ok(matchUserA, 'Technical User A must be in returned matches');
      assert.ok(matchUserB, 'Marketing User B must be in returned matches');

      console.log(`User A (Technical) Similarity Score: ${matchUserA.similarityScore.toFixed(4)}`);
      console.log(`User B (Marketing) Similarity Score: ${matchUserB.similarityScore.toFixed(4)}`);

      // Verify User A ranks higher than User B
      assert.ok(
        matchUserA.similarityScore > matchUserB.similarityScore,
        `User A technical similarity score (${matchUserA.similarityScore}) MUST be higher than User B marketing similarity score (${matchUserB.similarityScore})`,
      );

      // Verify AI Rationale generated
      assert.ok(matchUserA.aiRationale.length > 10, 'AI rationale must be generated for top candidate');
    } catch (err) {
      console.error('DoD Test 3 Failed with error:', err);
      throw err;
    }
  });

  it('DoD Requirement 4: Visibility Scoping — invite_only idea returns matches ONLY to owner, empty to other users', async () => {
    const inviteOnlyIdea = await ideaRepo.create({
      user_id: ownerId,
      title: 'Stealth AI Project',
      visibility: 'invite_only',
    });

    // Generate seeking_embedding vector for stealth idea
    const emb = await aiClient.generateEmbedding({ tags: ['Backend'] });
    await ideaRepo.updateSeekingEmbedding(inviteOnlyIdea.id, ['Backend'], emb);

    // Owner query -> returns matches
    const ownerMatches = await matchingService.getMatchesForIdea(ownerId, inviteOnlyIdea.id);
    assert.ok(ownerMatches.length > 0, 'Owner must see matches for invite_only idea');

    // Non-owner query -> returns empty array (restricted)
    const nonOwnerMatches = await matchingService.getMatchesForIdea(userA_TechnicalId, inviteOnlyIdea.id);
    assert.equal(nonOwnerMatches.length, 0, 'Non-owner MUST NOT see matches for invite_only idea');
  });
});
