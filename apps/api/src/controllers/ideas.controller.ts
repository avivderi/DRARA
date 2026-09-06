import type { Request, Response } from 'express';
import { z } from 'zod';

import { db } from '../db/connection';
import { AppError } from '../lib/errors';
import { KnexConnectedRepoRepository } from '../repositories/connected-repo.repository';
import { KnexIdeaRepository } from '../repositories/idea.repository';
import { AIServiceClient } from '../services/ai-service.client';
import { IdeasService } from '../services/ideas.service';

function makeIdeasService(): IdeasService {
  return new IdeasService(
    new KnexIdeaRepository(db),
    new KnexConnectedRepoRepository(db),
    new AIServiceClient(),
  );
}

const CreateIdeaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  manual_description: z.string().max(4000).optional(),
  visibility: z.enum(['public', 'private_ai_recommend', 'invite_only']).optional(),
});

const ConnectRepoSchema = z.object({
  github_repo_full_name: z.string().min(3).max(255),
  installation_id: z.string().min(1).max(100),
});

const ManualDescriptionSchema = z.object({
  manual_description: z.string().min(1).max(4000),
});

const VisibilitySchema = z.object({
  visibility: z.enum(['public', 'private_ai_recommend', 'invite_only']),
});

export const ideasController = {
  create: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const parsed = CreateIdeaSchema.safeParse(req.body);
    if (!parsed.success) throw AppError.badRequest(parsed.error.message);

    const service = makeIdeasService();
    const idea = await service.createIdea(
      userId,
      parsed.data.title,
      parsed.data.description,
      parsed.data.manual_description,
      parsed.data.visibility,
    );
    res.status(201).json(idea);
  },

  getMine: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const service = makeIdeasService();
    const ideas = await service.getUserIdeas(userId);
    res.json(ideas);
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const service = makeIdeasService();
    const idea = await service.getIdeaById(id);
    res.json(idea);
  },

  connectRepo: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();
    const ideaId = req.params['id'] as string;

    const parsed = ConnectRepoSchema.safeParse(req.body);
    if (!parsed.success) throw AppError.badRequest(parsed.error.message);

    const service = makeIdeasService();
    const repo = await service.connectRepo(
      userId,
      ideaId,
      parsed.data.github_repo_full_name,
      parsed.data.installation_id,
    );
    res.json(repo);
  },

  scan: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();
    const ideaId = req.params['id'] as string;
    const force = req.query['force'] === 'true';

    const service = makeIdeasService();
    const scanned = await service.scanIdea(userId, ideaId, force);
    res.json(scanned);
  },

  setManualDescription: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();
    const ideaId = req.params['id'] as string;

    const parsed = ManualDescriptionSchema.safeParse(req.body);
    if (!parsed.success) throw AppError.badRequest(parsed.error.message);

    const service = makeIdeasService();
    const updated = await service.setManualDescription(
      userId,
      ideaId,
      parsed.data.manual_description,
    );
    res.json(updated);
  },

  setVisibility: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();
    const ideaId = req.params['id'] as string;

    const parsed = VisibilitySchema.safeParse(req.body);
    if (!parsed.success) throw AppError.badRequest(parsed.error.message);

    const service = makeIdeasService();
    const updated = await service.setVisibility(
      userId,
      ideaId,
      parsed.data.visibility,
    );
    res.json(updated);
  },

  getPublicFeed: async (req: Request, res: Response): Promise<void> => {
    const limit = Math.min(Number(req.query['limit'] || 20), 100);
    const offset = Math.max(Number(req.query['offset'] || 0), 0);

    const service = makeIdeasService();
    const ideas = await service.getPublicIdeas(limit, offset);
    res.json({ ideas });
  },

  searchPublic: async (req: Request, res: Response): Promise<void> => {
    const q = req.query['q'] as string | undefined;
    const tagsStr = req.query['tags'] as string | undefined;
    const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : undefined;
    const limit = Math.min(Number(req.query['limit'] || 20), 100);
    const offset = Math.max(Number(req.query['offset'] || 0), 0);

    const service = makeIdeasService();
    const ideas = await service.searchPublicIdeas(q, tags, limit, offset);
    res.json({ ideas });
  },

  getPublicById: async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const userId = req.userId;

    const service = makeIdeasService();
    const idea = await service.getPublicIdeaById(id, userId);
    res.json(idea);
  },
};
