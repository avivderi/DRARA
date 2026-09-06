import { Router, Request, Response } from 'express';
import type { Knex } from 'knex';
import { z } from 'zod';

import { requireAuth } from '../middleware/auth.middleware';
import { KnexMatchRepository } from '../repositories/match.repository';
import { KnexUserRepository } from '../repositories/user.repository';
import {
  KnexDecisionRepository,
  KnexEquityRepository,
  KnexIdeaBoardRepository,
  KnexRoadmapRepository,
  KnexWorkspaceRepository,
} from '../repositories/workspace.repository';
import { AIServiceClient } from '../services/ai-service.client';
import { WorkspaceService } from '../services/workspace.service';

export function createWorkspacesRouter(db: Knex): Router {
  const router = Router();

  const workspaceRepo = new KnexWorkspaceRepository(db);
  const ideaBoardRepo = new KnexIdeaBoardRepository(db);
  const roadmapRepo = new KnexRoadmapRepository(db);
  const decisionRepo = new KnexDecisionRepository(db);
  const equityRepo = new KnexEquityRepository(db);
  const matchRepo = new KnexMatchRepository(db);
  const userRepo = new KnexUserRepository(db);
  const aiClient = new AIServiceClient();

  const workspaceService = new WorkspaceService(
    workspaceRepo,
    ideaBoardRepo,
    roadmapRepo,
    decisionRepo,
    equityRepo,
    matchRepo,
    userRepo,
    aiClient,
  );

  // Validation schemas
  const updateSectionSchema = z.object({
    content: z.string().max(10000, 'Content must not exceed 10,000 characters'),
  });

  const createMilestoneSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
    due_date: z.string().optional(),
    status: z.enum(['not_started', 'in_progress', 'done']).optional(),
    assigned_to: z.string().uuid().optional(),
  });

  const updateMilestoneSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().nullable().optional(),
    due_date: z.string().nullable().optional(),
    status: z.enum(['not_started', 'in_progress', 'done']).optional(),
    assigned_to: z.string().uuid().nullable().optional(),
  });

  const createDecisionSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    rationale: z.string().min(1, 'Rationale is required').max(5000),
  });

  const updateEquitySchema = z.object({
    topic: z.string().min(1, 'Topic is required'),
    discussed: z.boolean(),
  });

  // GET /workspaces/:workspaceId/overview
  router.get('/:workspaceId/overview', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;
    const overview = await workspaceService.getWorkspaceOverview(workspaceId, userId);
    res.json(overview);
  });

  // GET /workspaces/:workspaceId/idea-board
  router.get('/:workspaceId/idea-board', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;
    const board = await workspaceService.getIdeaBoard(workspaceId, userId);
    res.json({ sections: board });
  });

  // PATCH /workspaces/:workspaceId/idea-board/:section
  router.patch('/:workspaceId/idea-board/:section', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;
    const section = req.params['section']!;
    const body = updateSectionSchema.parse(req.body);

    const entry = await workspaceService.updateIdeaBoardSection(workspaceId, section, body.content, userId);
    res.json({ entry });
  });

  // GET /workspaces/:workspaceId/roadmap
  router.get('/:workspaceId/roadmap', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;
    const roadmap = await workspaceService.getRoadmap(workspaceId, userId);
    res.json({ milestones: roadmap });
  });

  // POST /workspaces/:workspaceId/roadmap
  router.post('/:workspaceId/roadmap', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;
    const body = createMilestoneSchema.parse(req.body);

    const milestone = await workspaceService.createMilestone(workspaceId, userId, body);
    res.status(201).json({ milestone });
  });

  // PATCH /workspaces/:workspaceId/roadmap/:milestoneId
  router.patch('/:workspaceId/roadmap/:milestoneId', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;
    const milestoneId = req.params['milestoneId']!;
    const body = updateMilestoneSchema.parse(req.body);

    const updated = await workspaceService.updateMilestone(workspaceId, milestoneId, userId, body);
    res.json({ milestone: updated });
  });

  // POST /workspaces/:workspaceId/roadmap/ai-suggest
  router.post('/:workspaceId/roadmap/ai-suggest', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;

    const milestones = await workspaceService.suggestAIMilestones(workspaceId, userId);
    res.status(201).json({ milestones });
  });

  // GET /workspaces/:workspaceId/decisions
  router.get('/:workspaceId/decisions', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;
    const decisions = await workspaceService.getDecisions(workspaceId, userId);
    res.json({ decisions });
  });

  // POST /workspaces/:workspaceId/decisions
  router.post('/:workspaceId/decisions', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;
    const body = createDecisionSchema.parse(req.body);

    const decision = await workspaceService.createDecision(workspaceId, userId, body);
    res.status(201).json({ decision });
  });

  // GET /workspaces/:workspaceId/equity
  router.get('/:workspaceId/equity', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;
    const equity = await workspaceService.getEquityFramework(workspaceId, userId);
    res.json(equity);
  });

  // PATCH /workspaces/:workspaceId/equity
  router.patch('/:workspaceId/equity', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const workspaceId = req.params['workspaceId']!;
    const body = updateEquitySchema.parse(req.body);

    const updated = await workspaceService.updateEquityTopic(workspaceId, body.topic, body.discussed, userId);
    res.json(updated);
  });

  return router;
}
