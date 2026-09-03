import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { db } from '../db/connection';
import { connectRedis, redis, redisClient } from '../lib/redis';
import { KnexConnectedRepoRepository } from '../repositories/connected-repo.repository';
import { KnexIdeaRepository } from '../repositories/idea.repository';
import { KnexUserRepository } from '../repositories/user.repository';
import { AIServiceClient } from './ai-service.client';
import { IdeasService } from './ideas.service';

describe('Module 2 Integration Tests: Real AI Scan & Real Redis Rate Limiting', () => {
  let userRepo: KnexUserRepository;
  let ideaRepo: KnexIdeaRepository;
  let connectedRepoRepo: KnexConnectedRepoRepository;
  let aiClient: AIServiceClient;
  let ideasService: IdeasService;
  let testUserId: string;

  before(async () => {
    // 1. Verify Postgres connection
    await db.raw('SELECT 1');

    // 2. Verify Redis connection
    await connectRedis();
    await redis.ping();

    userRepo = new KnexUserRepository(db);
    ideaRepo = new KnexIdeaRepository(db);
    connectedRepoRepo = new KnexConnectedRepoRepository(db);
    aiClient = new AIServiceClient('http://localhost:8000'); // Real FastAPI microservice
    ideasService = new IdeasService(ideaRepo, connectedRepoRepo, aiClient);

    // Create a real test user in PostgreSQL
    const user = await userRepo.create({
      name: 'E2E Real Tester',
      email: 'e2e.tester@drara.io',
      provider: 'github',
      provider_id: 'gh_real_e2e_123',
    });
    testUserId = user.id;
  });

  beforeEach(async () => {
    // Flush test rate limit keys in Real Redis
    const today = new Date().toISOString().slice(0, 10);
    await redisClient.del(`rate:scan:${testUserId}:${today}`);
  });

  after(async () => {
    // Cleanup database
    await db('connected_repos').where({ user_id: testUserId }).del();
    await db('ideas').where({ user_id: testUserId }).del();
    await db('users').where({ id: testUserId }).del();
  });

  it('Requirement 2: Real End-to-End Scan via FastAPI AI Service & PostgreSQL save', async () => {
    // Create an idea
    const idea = await ideasService.createIdea(testUserId, 'DRARA E2E Startup', 'Fullstack AI platform');

    // Connect real repository reference
    await ideasService.connectRepo(testUserId, idea.id, 'avivderi/DRARA', 'inst_real_test');

    // Execute REAL scan against FastAPI microservice with force=true
    const scanned = await ideasService.scanIdea(testUserId, idea.id, true);

    // Verify scan results saved in Real PostgreSQL database
    assert.ok(scanned.id);
    assert.ok(scanned.ai_summary && scanned.ai_summary.length > 10, 'AI summary must be populated');
    assert.ok(Array.isArray(scanned.stack_detected), 'Stack detected must be an array');
    const scoreNum = Number(scanned.readiness_score);
    assert.ok(scoreNum >= 1 && scoreNum <= 10, 'Readiness score must be between 1 and 10');
    assert.ok(scanned.readiness_rationale.length > 0, 'Readiness rationale must be populated');
    assert.ok(scanned.last_scanned_at, 'last_scanned_at timestamp must be updated in Postgres');

    // Verify DB record directly
    const dbRecord = await ideaRepo.findById(idea.id);
    assert.equal(dbRecord?.ai_summary, scanned.ai_summary);
    assert.ok(dbRecord?.stack_detected, 'DB record must store stack_detected');
    assert.equal(Number(dbRecord?.readiness_score), Number(scanned.readiness_score));
  });

  it('Requirement 3: Real Redis Rate Limiting — 6 consecutive scans block 6th request', async () => {
    const idea = await ideasService.createIdea(testUserId, 'Rate Limit Test Idea');

    // Perform 5 consecutive scans (max allowed per day)
    for (let i = 1; i <= 5; i++) {
      const result = await ideasService.scanIdea(testUserId, idea.id, true);
      assert.ok(result, `Scan #${i} should succeed`);
    }

    // 6th scan MUST be blocked by Real Redis Rate Limiter
    await assert.rejects(
      () => ideasService.scanIdea(testUserId, idea.id, true),
      (err: any) => {
        assert.equal(err.code, 'RATE_LIMIT_EXCEEDED');
        assert.ok(err.message.includes('Rate limit exceeded'), 'Message must indicate rate limit');
        return true;
      },
    );
  });
});
