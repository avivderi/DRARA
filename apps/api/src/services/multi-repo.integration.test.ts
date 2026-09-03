import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

import { db } from '../db/connection';
import { connectRedis, redis } from '../lib/redis';
import { KnexConnectedRepoRepository } from '../repositories/connected-repo.repository';
import { KnexIdeaRepository } from '../repositories/idea.repository';
import { KnexUserRepository } from '../repositories/user.repository';
import { AIServiceClient } from './ai-service.client';
import { IdeasService } from './ideas.service';

describe('Multi-Repo Integration Verification: Distinct Repository AI Analysis', () => {
  let userRepo: KnexUserRepository;
  let ideaRepo: KnexIdeaRepository;
  let connectedRepoRepo: KnexConnectedRepoRepository;
  let aiClient: AIServiceClient;
  let ideasService: IdeasService;
  let testUserId: string;

  before(async () => {
    await db.raw('SELECT 1');
    await connectRedis();
    await redis.ping();

    userRepo = new KnexUserRepository(db);
    ideaRepo = new KnexIdeaRepository(db);
    connectedRepoRepo = new KnexConnectedRepoRepository(db);
    aiClient = new AIServiceClient('http://localhost:8000');
    ideasService = new IdeasService(ideaRepo, connectedRepoRepo, aiClient);

    const user = await userRepo.create({
      name: 'Multi-Repo Founder',
      email: 'founder.multirepo@drara.io',
      provider: 'github',
      provider_id: 'gh_multi_repo_user_77',
    });
    testUserId = user.id;
  });

  after(async () => {
    await db('connected_repos').where({ user_id: testUserId }).del();
    await db('ideas').where({ user_id: testUserId }).del();
    await db('users').where({ id: testUserId }).del();
  });

  it('Requirement 1: Scans Private Repo 1 (Italian Pasta Vue.js App) and returns specific pasta & Vue architecture', async () => {
    // 1. Create Idea 1
    const idea1 = await ideasService.createIdea(
      testUserId,
      'MammaMia Italian Culinary App',
      'Authentic Italian recipe platform',
    );

    // 2. Connect Repo 1 via GitHub App flow
    const connectedRepo1 = await ideasService.connectRepo(
      testUserId,
      idea1.id,
      'avivderi/mammamias-pasta-recipes',
      'inst_private_pasta_app',
    );
    assert.equal(connectedRepo1.github_repo_full_name, 'avivderi/mammamias-pasta-recipes');

    // 3. Execute Scan
    const scanResult1 = await ideasService.scanIdea(testUserId, idea1.id, true);

    // 4. Assert specific content & Vue stack
    assert.ok(
      scanResult1.ai_summary.toLowerCase().includes('pasta') ||
        scanResult1.ai_summary.toLowerCase().includes('recipe') ||
        scanResult1.ai_summary.toLowerCase().includes('culinary'),
      'AI summary must specifically mention Italian pasta / culinary recipes domain',
    );
    assert.ok(
      scanResult1.stack_detected.some((s) => s.includes('Vue') || s.includes('JavaScript') || s.includes('TypeScript')),
      'Detected stack must contain Vue / JS frontend technology',
    );
  });

  it('Requirement 2: Scans Private Repo 2 (Go E-Commerce Engine) and returns distinct Go & order matching architecture', async () => {
    // 1. Create Idea 2
    const idea2 = await ideasService.createIdea(
      testUserId,
      'GoTrade E-Commerce Engine',
      'High throughput order matching system',
    );

    // 2. Connect Repo 2 via GitHub App flow
    const connectedRepo2 = await ideasService.connectRepo(
      testUserId,
      idea2.id,
      'avivderi/gotrade-ecommerce-engine',
      'inst_private_gotrade_app',
    );
    assert.equal(connectedRepo2.github_repo_full_name, 'avivderi/gotrade-ecommerce-engine');

    // 3. Execute Scan
    const scanResult2 = await ideasService.scanIdea(testUserId, idea2.id, true);

    // 4. Assert specific content & Go stack
    assert.ok(
      scanResult2.ai_summary.toLowerCase().includes('e-commerce') ||
        scanResult2.ai_summary.toLowerCase().includes('trading') ||
        scanResult2.ai_summary.toLowerCase().includes('engine') ||
        scanResult2.ai_summary.toLowerCase().includes('order'),
      'AI summary must specifically mention Go / E-Commerce trading engine domain',
    );
    assert.ok(
      scanResult2.stack_detected.some((s) => s.includes('Go')),
      'Detected stack must contain Go backend language',
    );
  });

  it('Requirement 3: Verifies that summaries for distinct repos are fundamentally different (no boilerplate)', async () => {
    const ideas = await ideasService.getUserIdeas(testUserId);
    assert.equal(ideas.length, 2);

    const summary1 = ideas[0]?.ai_summary ?? '';
    const summary2 = ideas[1]?.ai_summary ?? '';

    assert.notEqual(summary1, summary2, 'AI summaries for distinct repositories MUST NOT be identical boilerplate');
    assert.notDeepEqual(ideas[0]?.stack_detected, ideas[1]?.stack_detected, 'Detected stacks MUST reflect distinct codebases');
  });
});
