import { Router } from 'express';

import { MatchingController } from '../controllers/matching.controller';
import { db } from '../db/connection';
import { requireAuth } from '../middleware/auth.middleware';
import { KnexIdeaRepository } from '../repositories/idea.repository';
import { KnexUserRepository } from '../repositories/user.repository';
import { AIServiceClient } from '../services/ai-service.client';
import { MatchingService } from '../services/matching.service';

const ideaRepo = new KnexIdeaRepository(db);
const userRepo = new KnexUserRepository(db);
const aiClient = new AIServiceClient();
const matchingService = new MatchingService(ideaRepo, userRepo, aiClient);
const matchingController = new MatchingController(matchingService);

export const matchingRouter = Router();

matchingRouter.use(requireAuth);

matchingRouter.get('/ideas/:id/matches', matchingController.getIdeaMatches);
