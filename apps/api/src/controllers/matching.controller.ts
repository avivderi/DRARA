import type { Request, Response } from 'express';

import { db } from '../db/connection';
import { AppError } from '../lib/errors';
import { KnexIdeaRepository } from '../repositories/idea.repository';
import { KnexUserRepository } from '../repositories/user.repository';
import { MatchingService } from '../services/matching.service';

export const matchingController = {
  /** GET /ideas/:id/matches — returns embedding-based co-founder matches for an idea */
  getMatchesForIdea: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const ideaId = req.params['id'];
    if (!ideaId) throw AppError.badRequest('Idea ID is required');

    const forceRecompute = req.query['force'] === 'true';

    const ideaRepo = new KnexIdeaRepository(db);
    const userRepo = new KnexUserRepository(db);
    const matchingService = new MatchingService(db, ideaRepo, userRepo);

    const matches = await matchingService.findMatchesForIdea(userId, ideaId, 10, forceRecompute);
    res.json(matches);
  },

  /** GET /users/me/matches — returns embedding-based idea matches for a user */
  getMatchesForUser: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const forceRecompute = req.query['force'] === 'true';

    const ideaRepo = new KnexIdeaRepository(db);
    const userRepo = new KnexUserRepository(db);
    const matchingService = new MatchingService(db, ideaRepo, userRepo);

    const matches = await matchingService.findMatchesForUser(userId, 10, forceRecompute);
    res.json(matches);
  },
};
