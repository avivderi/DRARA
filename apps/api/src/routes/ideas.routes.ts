import { Router } from 'express';

import { ideasController } from '../controllers/ideas.controller';
import { requireAuth } from '../middleware/auth.middleware';


export const ideasRouter = Router();

// Public routes (accessible publicly or authenticated)
ideasRouter.get('/public', ideasController.getPublicFeed);
ideasRouter.get('/public/search', ideasController.searchPublic);
ideasRouter.get('/public/:id', ideasController.getPublicById);

// Protected routes below
ideasRouter.use(requireAuth);

ideasRouter.post('/', ideasController.create);
ideasRouter.get('/me', ideasController.getMine);
ideasRouter.get('/:id', ideasController.getById);
ideasRouter.post('/:id/connect-repo', ideasController.connectRepo);
ideasRouter.post('/:id/scan', ideasController.scan);
ideasRouter.post('/:id/manual-description', ideasController.setManualDescription);
ideasRouter.patch('/:id/visibility', ideasController.setVisibility);
