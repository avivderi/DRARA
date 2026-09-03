import assert from 'node:assert/strict';
import { describe, it, before, after } from 'node:test';

import { db } from '../db/connection';
import { connectRedis, redis } from '../lib/redis';
import { KnexIdeaRepository } from '../repositories/idea.repository';
import { KnexUserRepository } from '../repositories/user.repository';

import { EmbeddingServiceClient } from './embedding-service.client';
import { MatchingService } from './matching.service';

describe('Module 3 Real pgvector Integration Tests: Vector Ranking & Visibility', () => {
  let userRepo: KnexUserRepository;
  let ideaRepo: KnexIdeaRepository;
  let embeddingClient: EmbeddingServiceClient;
  let matchingService: MatchingService;

  let founderUser: any;
  let backendUser: any;
  let marketingUser: any;
  let backendIdea: any;

  before(async () => {
    // 1. Verify Postgres & pgvector
    await db.raw('SELECT 1');
    await connectRedis();
    await redis.ping();

    // Clean up any stale records from previous test runs
    const testEmails = ['founder.vector@drara.io', 'alice.backend@drara.io', 'bob.marketing@drara.io'];
    await db('ideas').whereIn('user_id', db('users').select('id').whereIn('email', testEmails)).del();
    await db('users').whereIn('email', testEmails).del();

    userRepo = new KnexUserRepository(db);
    ideaRepo = new KnexIdeaRepository(db);
    embeddingClient = new EmbeddingServiceClient('http://localhost:8000');
    matchingService = new MatchingService(db, ideaRepo, userRepo, embeddingClient);

    // 2. Create Founder User
    founderUser = await userRepo.create({
      name: 'Founder User',
      email: 'founder.vector@drara.io',
      provider: 'github',
      provider_id: 'gh_founder_vector_101',
    });

    // 3. Create Candidate User A (Backend / DevOps Specialist)
    backendUser = await userRepo.create({
      name: 'Alice Backend',
      email: 'alice.backend@drara.io',
      provider: 'github',
      provider_id: 'gh_backend_alice_102',
    });
    const backendOffering = ['Backend', 'DevOps', 'AWS', 'Node.js', 'PostgreSQL', 'Docker'];
    await userRepo.update(backendUser.id, {
      offering_tags: backendOffering,
      seeking_tags: ['Backend', 'Cloud Infrastructure'],
      bio: 'Senior Backend Engineer specialized in distributed systems, PostgreSQL, AWS, and DevOps pipelines.',
    });
    const backendVector = await embeddingClient.generateEmbedding(backendOffering.join(' ') + ' Senior Backend Engineer');
    await userRepo.updateEmbeddings(backendUser.id, backendVector, backendVector);

    // 4. Create Candidate User B (Marketing / Sales Specialist)
    marketingUser = await userRepo.create({
      name: 'Bob Marketing',
      email: 'bob.marketing@drara.io',
      provider: 'github',
      provider_id: 'gh_marketing_bob_103',
    });
    const marketingOffering = ['Marketing', 'Sales', 'Growth', 'Content Strategy', 'Social Media'];
    await userRepo.update(marketingUser.id, {
      offering_tags: marketingOffering,
      seeking_tags: ['Growth', 'Marketing Lead'],
      bio: 'Growth Hacker and Marketing lead experienced in B2B SaaS sales campaigns and content creation.',
    });
    const marketingVector = await embeddingClient.generateEmbedding(marketingOffering.join(' ') + ' Growth Hacker Marketing lead');
    await userRepo.updateEmbeddings(marketingUser.id, marketingVector, marketingVector);

    // 5. Create Idea requiring Backend / DevOps expertise
    backendIdea = await ideaRepo.create({
      user_id: founderUser.id,
      title: 'Cloud Native Microservices Platform',
      description: 'Building high throughput microservices infrastructure requiring deep DevOps, Docker, and AWS skills.',
      seeking_tags: ['Backend', 'DevOps', 'AWS', 'Kubernetes'],
      visibility: 'public',
    });
    const seekingVector = await embeddingClient.generateEmbedding('Backend DevOps AWS Kubernetes Cloud Native Microservices');
    await ideaRepo.updateSeekingEmbedding(backendIdea.id, seekingVector);
  });

  after(async () => {
    if (backendIdea?.id) {
      await db('ideas').where({ id: backendIdea.id }).del();
    }
    const testEmails = ['founder.vector@drara.io', 'alice.backend@drara.io', 'bob.marketing@drara.io'];
    await db('ideas').whereIn('user_id', db('users').select('id').whereIn('email', testEmails)).del();
    await db('users').whereIn('email', testEmails).del();
  });

  it('Requirement 1: Real pgvector Cosine Similarity ranks Backend User A significantly higher than Marketing User B', async () => {
    const matches = await matchingService.findMatchesForIdea(founderUser.id, backendIdea.id, 10, true);

    assert.ok(matches.length >= 2, 'Must return at least 2 candidate matches');

    const topMatch = matches[0];
    const secondMatch = matches[1];

    // Assert top match is Alice Backend
    assert.equal(topMatch.user.id, backendUser.id, 'Top candidate MUST be Backend Engineer Alice');
    assert.equal(secondMatch.user.id, marketingUser.id, 'Second candidate MUST be Marketing User Bob');

    // Assert Cosine Similarity of User A > User B
    assert.ok(
      topMatch.similarity_score > secondMatch.similarity_score,
      `Backend User A score (${topMatch.similarity_score}) MUST be higher than Marketing User B score (${secondMatch.similarity_score})`,
    );

    // Assert Top-1 match includes AI match rationale
    assert.ok(topMatch.match_rationale.length > 10, 'Match rationale must be generated for top match');
  });

  it('Requirement 2: Visibility Security Rule blocks unauthorized non-owner users from reading matches of private ideas', async () => {
    // Create an invite_only idea
    const stealthIdea = await ideaRepo.create({
      user_id: founderUser.id,
      title: 'Stealth AI Platform',
      visibility: 'invite_only',
    });

    // Founder can access matches
    const founderMatches = await matchingService.findMatchesForIdea(founderUser.id, stealthIdea.id, 10, true);
    assert.ok(Array.isArray(founderMatches));

    // Unauthorized user CANNOT access matches
    await assert.rejects(
      () => matchingService.findMatchesForIdea(backendUser.id, stealthIdea.id, 10, true),
      (err: any) => {
        assert.equal(err.code, 'MATCHES_PRIVATE_TO_OWNER');
        assert.equal(err.statusCode, 403);
        return true;
      },
    );

    // Cleanup stealth idea
    await db('ideas').where({ id: stealthIdea.id }).del();
  });

  it('Requirement 3: Symmetric Matching — findMatchesForUser returns matching public ideas for a user', async () => {
    const matches = await matchingService.findMatchesForUser(backendUser.id, 10, true);
    assert.ok(Array.isArray(matches), 'Must return an array of idea matches');
    assert.ok(matches.length >= 1, 'Must find at least 1 matching public idea');
    assert.equal(matches[0].idea.id, backendIdea.id, 'Top idea match for Backend User MUST be Cloud Native Microservices Platform');
  });
});
