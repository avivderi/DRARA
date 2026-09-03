import { Router } from 'express';

import { matchingController } from '../controllers/matching.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const matchingRouter = Router();

matchingRouter.get('/ideas/:id/matches', authMiddleware, matchingController.getMatchesForIdea);
matchingRouter.get('/users/me/matches', authMiddleware, matchingController.getMatchesForUser);
