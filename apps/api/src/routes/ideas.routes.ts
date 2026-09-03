import { Router } from 'express';

import { ideasController } from '../controllers/ideas.controller';
import { requireAuth } from '../middleware/auth.middleware';

export const ideasRouter = Router();

ideasRouter.use(requireAuth);

ideasRouter.post('/', ideasController.create);
ideasRouter.get('/me', ideasController.getMine);
ideasRouter.get('/:id', ideasController.getById);
ideasRouter.post('/:id/connect-repo', ideasController.connectRepo);
ideasRouter.post('/:id/scan', ideasController.scan);
ideasRouter.post('/:id/manual-description', ideasController.setManualDescription);
ideasRouter.patch('/:id/visibility', ideasController.setVisibility);
