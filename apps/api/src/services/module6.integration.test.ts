import assert from 'node:assert/strict';
import { describe, it, before, after } from 'node:test';

import { db } from '../db/connection';
import { KnexHandshakeEventRepository } from '../repositories/handshake-event.repository';
import { KnexIdeaRepository } from '../repositories/idea.repository';
import { KnexMatchRepository } from '../repositories/match.repository';
import { KnexUserRepository } from '../repositories/user.repository';
import {
  KnexDecisionRepository,
  KnexEquityRepository,
  KnexIdeaBoardRepository,
  KnexRoadmapRepository,
  KnexWorkspaceRepository,
} from '../repositories/workspace.repository';
import { HandshakeService } from './handshake.service';
import { WorkspaceService, LEGAL_DISCLAIMER } from './workspace.service';

describe('Module 6 Integration Tests (Live PostgreSQL DB)', () => {
  let userRepo: KnexUserRepository;
  let ideaRepo: KnexIdeaRepository;
  let matchRepo: KnexMatchRepository;
  let handshakeEventRepo: KnexHandshakeEventRepository;
  let workspaceRepo: KnexWorkspaceRepository;
  let ideaBoardRepo: KnexIdeaBoardRepository;
  let roadmapRepo: KnexRoadmapRepository;
  let decisionRepo: KnexDecisionRepository;
  let equityRepo: KnexEquityRepository;

  let handshakeService: HandshakeService;
  let workspaceService: WorkspaceService;

  let userAId: string;
  let userBId: string;
  let userCId: string;
  let ideaId: string;
  let matchId: string;
  let workspaceId: string;

  before(async () => {
    userRepo = new KnexUserRepository(db);
    ideaRepo = new KnexIdeaRepository(db);
    matchRepo = new KnexMatchRepository(db);
    handshakeEventRepo = new KnexHandshakeEventRepository(db);
    workspaceRepo = new KnexWorkspaceRepository(db);
    ideaBoardRepo = new KnexIdeaBoardRepository(db);
    roadmapRepo = new KnexRoadmapRepository(db);
    decisionRepo = new KnexDecisionRepository(db);
    equityRepo = new KnexEquityRepository(db);

    handshakeService = new HandshakeService(
      matchRepo,
      handshakeEventRepo,
      userRepo,
      undefined,
      workspaceRepo,
    );

    workspaceService = new WorkspaceService(
      workspaceRepo,
      ideaBoardRepo,
      roadmapRepo,
      decisionRepo,
      equityRepo,
      matchRepo,
      userRepo,
    );

    // Create User A, User B, User C
    const userA = await userRepo.create({
      name: 'Mod6 User A',
      email: `mod6a-${Date.now()}@example.com`,
      provider: 'github',
      provider_id: `gh-mod6a-${Date.now()}`,
    });
    const userB = await userRepo.create({
      name: 'Mod6 User B',
      email: `mod6b-${Date.now()}@example.com`,
      provider: 'github',
      provider_id: `gh-mod6b-${Date.now()}`,
    });
    const userC = await userRepo.create({
      name: 'Mod6 User C',
      email: `mod6c-${Date.now()}@example.com`,
      provider: 'github',
      provider_id: `gh-mod6c-${Date.now()}`,
    });

    userAId = userA.id;
    userBId = userB.id;
    userCId = userC.id;

    // Create Idea and Match
    const idea = await ideaRepo.create({
      user_id: userAId,
      title: 'Decentralized AI Marketplace',
      description: 'Open network for AI model trading',
      visibility: 'public',
    });
    ideaId = idea.id;

    const match = await matchRepo.create({
      idea_id: ideaId,
      user1_id: userAId,
      user2_id: userBId,
      compatibility_score: 0.92,
    });
    matchId = match.id;
  });

  after(async () => {
    if (workspaceId) await db('workspaces').where({ id: workspaceId }).del();
    if (matchId) await db('matches').where({ id: matchId }).del();
    if (ideaId) await db('ideas').where({ id: ideaId }).del();
    if (userAId) await db('users').where({ id: userAId }).del();
    if (userBId) await db('users').where({ id: userBId }).del();
    if (userCId) await db('users').where({ id: userCId }).del();
  });

  it('DoD 1: Automatic Workspace Creation via NFC Verification', async () => {
    // 1. Initiate NFC handshake
    const challenge = await handshakeService.initiateHandshake(matchId, userAId);
    assert.ok(challenge.challengeToken);

    // 2. Signer User B completes NFC verification
    const verifyRes = await handshakeService.verifyHandshake({
      matchId,
      signerUserId: userBId,
      challengeToken: challenge.challengeToken,
      nfcTokenSignature: 'sig_valid_nfc_signature_token_mod6',
      locationHash: 'loc_hash_tlv_tech_hub',
    });

    assert.equal(verifyRes.match.status, 'confirmed');

    // 3. Verify workspace was automatically created in Postgres for this match
    const createdWs = await workspaceRepo.findByMatchId(matchId);
    assert.ok(createdWs);
    assert.equal(createdWs.match_id, matchId);
    workspaceId = createdWs.id;
  });

  it('DoD 2: Strict Authorization — Non-match user (User C) gets 403 Forbidden', async () => {
    // User A and User B can access overview
    const overviewA = await workspaceService.getWorkspaceOverview(workspaceId, userAId);
    assert.equal(overviewA.workspace.id, workspaceId);

    // User C (outsider) gets 403 Forbidden
    await assert.rejects(
      () => workspaceService.getWorkspaceOverview(workspaceId, userCId),
      (err: any) => {
        assert.equal(err.statusCode, 403);
        assert.ok(err.message.includes('Access denied'));
        return true;
      },
    );
  });

  it('DoD 3: Idea Board, Roadmap & Decision Log E2E in Postgres', async () => {
    // 1. Update Idea Board vision section
    const sectionRes = await workspaceService.updateIdeaBoardSection(
      workspaceId,
      'vision',
      'Revolutionize AI market with zero-trust contracts',
      userAId,
    );
    assert.equal(sectionRes.section, 'vision');

    // 2. Create and update Roadmap Milestone
    const milestone = await workspaceService.createMilestone(workspaceId, userAId, {
      title: 'Finalize Smart Contract Specs',
      description: 'Complete security audit of smart contract',
      status: 'in_progress',
    });
    assert.ok(milestone.id);

    const updatedMs = await workspaceService.updateMilestone(workspaceId, milestone.id, userBId, {
      status: 'done',
    });
    assert.equal(updatedMs.status, 'done');

    // 3. Create Decision Log entry
    const decision = await workspaceService.createDecision(workspaceId, userBId, {
      title: 'Deploy to Ethereum L2 Orbit Chain',
      rationale: 'Sub-cent transaction fees and EVM compatibility',
    });
    assert.ok(decision.id);

    // 4. Verify Overview updates
    const overview = await workspaceService.getWorkspaceOverview(workspaceId, userBId);
    assert.equal(overview.roadmap_summary.total_milestones, 1);
    assert.equal(overview.roadmap_summary.completed_milestones, 1);
    assert.equal(overview.decisions_summary.total_decisions, 1);
  });

  it('DoD 4: Equity Discussion Tracking & Non-Legal Disclaimer', async () => {
    // 1. Fetch framework
    const framework = await workspaceService.getEquityFramework(workspaceId, userAId);
    assert.equal(framework.topics.length, 4);
    assert.equal(framework.disclaimer, LEGAL_DISCLAIMER);

    // 2. Mark topic as discussed
    const updated = await workspaceService.updateEquityTopic(
      workspaceId,
      'vesting_schedule',
      true,
      userAId,
    );
    assert.equal(updated.topic, 'vesting_schedule');
    assert.equal(updated.discussed, true);
    assert.equal(updated.disclaimer, LEGAL_DISCLAIMER);

    // Verify summary count in overview
    const overview = await workspaceService.getWorkspaceOverview(workspaceId, userBId);
    assert.equal(overview.equity_summary.topics_discussed, 1);
  });
});
