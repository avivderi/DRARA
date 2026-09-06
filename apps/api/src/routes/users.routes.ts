import { Router } from 'express';

import { usersController } from '../controllers/users.controller';
import { requireAuth } from '../middleware/auth.middleware';

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get('/me', usersController.getMe);
usersRouter.get('/me/full-profile', usersController.getFullProfile);
usersRouter.get('/me/partnerships', usersController.getPartnerships);
usersRouter.patch('/me', usersController.updateMe);
