import { Router } from 'express';

import { ideasController } from '../controllers/ideas.controller';
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

export const ideasRouter = Router();

ideasRouter.use(requireAuth);

ideasRouter.post('/', ideasController.create);
ideasRouter.get('/me', ideasController.getMine);
ideasRouter.get('/:id', ideasController.getById);
ideasRouter.get('/:id/matches', matchingController.getIdeaMatches);
ideasRouter.post('/:id/connect-repo', ideasController.connectRepo);
ideasRouter.post('/:id/scan', ideasController.scan);
ideasRouter.post('/:id/manual-description', ideasController.setManualDescription);
ideasRouter.patch('/:id/visibility', ideasController.setVisibility);
