import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

import { FakeMatchRepository } from '../repositories/match.repository.fake';
import { FakeUserRepository } from '../repositories/user.repository.fake';
import {
  FakeDecisionRepository,
  FakeEquityRepository,
  FakeIdeaBoardRepository,
  FakeRoadmapRepository,
  FakeWorkspaceRepository,
} from '../repositories/workspace.repository.fake';

import { WorkspaceService, LEGAL_DISCLAIMER } from './workspace.service';

describe('WorkspaceService Unit Tests', () => {
  let wsRepo: FakeWorkspaceRepository;
  let ideaBoardRepo: FakeIdeaBoardRepository;
  let roadmapRepo: FakeRoadmapRepository;
  let decisionRepo: FakeDecisionRepository;
  let equityRepo: FakeEquityRepository;
  let matchRepo: FakeMatchRepository;
  let userRepo: FakeUserRepository;
  let service: WorkspaceService;

  let userAId: string;
  let userBId: string;
  let userCId: string;
  let matchId: string;
  let workspaceId: string;

  beforeEach(async () => {
    wsRepo = new FakeWorkspaceRepository();
    ideaBoardRepo = new FakeIdeaBoardRepository();
    roadmapRepo = new FakeRoadmapRepository();
    decisionRepo = new FakeDecisionRepository();
    equityRepo = new FakeEquityRepository();
    matchRepo = new FakeMatchRepository();
    userRepo = new FakeUserRepository();

    service = new WorkspaceService(
      wsRepo,
      ideaBoardRepo,
      roadmapRepo,
      decisionRepo,
      equityRepo,
      matchRepo,
      userRepo,
    );

    const userA = await userRepo.create({ name: 'User A', email: 'a@test.com', provider: 'github', provider_id: 'gh_a' });
    const userB = await userRepo.create({ name: 'User B', email: 'b@test.com', provider: 'github', provider_id: 'gh_b' });
    const userC = await userRepo.create({ name: 'User C', email: 'c@test.com', provider: 'github', provider_id: 'gh_c' });

    userAId = userA.id;
    userBId = userB.id;
    userCId = userC.id;

    const match = await matchRepo.create({
      idea_id: 'idea_1',
      user1_id: userAId,
      user2_id: userBId,
      status: 'confirmed',
    });
    matchId = match.id;

    const ws = await wsRepo.create({ match_id: matchId, project_name: 'Super AI Venture' });
    workspaceId = ws.id;
  });

  it('getWorkspaceOverview returns aggregated summary for match member', async () => {
    const overview = await service.getWorkspaceOverview(workspaceId, userAId);
    assert.equal(overview.workspace.id, workspaceId);
    assert.equal(overview.workspace.project_name, 'Super AI Venture');
    assert.equal(overview.team_members.length, 2);
    assert.equal(overview.roadmap_summary.total_milestones, 0);
    assert.equal(overview.equity_summary.total_topics, 4);
  });

  it('verifyWorkspaceAccess blocks non-member user with 403 Forbidden', async () => {
    await assert.rejects(
      () => service.getWorkspaceOverview(workspaceId, userCId),
      (err: any) => {
        assert.equal(err.statusCode, 403);
        assert.ok(err.message.includes('Access denied'));
        return true;
      },
    );
  });

  it('updateIdeaBoardSection updates section content using last-write-wins', async () => {
    await service.updateIdeaBoardSection(workspaceId, 'vision', 'Build the best co-founder platform', userAId);
    const board = await service.getIdeaBoard(workspaceId, userAId);

    const visionSection = board.find((s) => s.section === 'vision');
    assert.ok(visionSection);
    assert.equal(visionSection.content, 'Build the best co-founder platform');

    await service.updateIdeaBoardSection(workspaceId, 'vision', 'Updated vision text', userBId);
    const updatedBoard = await service.getIdeaBoard(workspaceId, userAId);
    const updatedVision = updatedBoard.find((s) => s.section === 'vision');
    assert.equal(updatedVision?.content, 'Updated vision text');
    assert.equal(updatedVision?.updated_by, userBId);
  });

  it('createMilestone and updateMilestone lifecycle', async () => {
    const ms = await service.createMilestone(workspaceId, userAId, {
      title: 'Setup Initial DB Schema',
      description: 'Create PostgreSQL tables',
      status: 'not_started',
    });
    assert.ok(ms.id);
    assert.equal(ms.status, 'not_started');

    const updated = await service.updateMilestone(workspaceId, ms.id, userBId, {
      status: 'done',
    });
    assert.equal(updated.status, 'done');

    const roadmap = await service.getRoadmap(workspaceId, userAId);
    assert.equal(roadmap.length, 1);
    assert.equal(roadmap[0]!.status, 'done');
  });

  it('createDecision records decision log entry', async () => {
    const decision = await service.createDecision(workspaceId, userAId, {
      title: 'Use PostgreSQL + pgvector',
      rationale: 'Scalable vector search and relational integrity',
    });
    assert.ok(decision.id);
    assert.equal(decision.title, 'Use PostgreSQL + pgvector');

    const list = await service.getDecisions(workspaceId, userBId);
    assert.equal(list.length, 1);
    assert.equal(list[0]!.rationale, 'Scalable vector search and relational integrity');
  });

  it('getEquityFramework returns topics list and non-legal disclaimer', async () => {
    const res = await service.getEquityFramework(workspaceId, userAId);
    assert.equal(res.topics.length, 4);
    assert.equal(res.disclaimer, LEGAL_DISCLAIMER);
    assert.equal(res.topics[0]!.discussed, false);

    const updated = await service.updateEquityTopic(workspaceId, 'equity_split', true, userBId);
    assert.equal(updated.topic, 'equity_split');
    assert.equal(updated.discussed, true);
    assert.equal(updated.disclaimer, LEGAL_DISCLAIMER);
  });
});
