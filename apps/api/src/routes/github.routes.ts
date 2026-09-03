import { Router } from 'express';

import { githubController } from '../controllers/github.controller';
import { requireAuth } from '../middleware/auth.middleware';

export const githubRouter = Router();

// Public webhook and install URL
githubRouter.get('/install-url', githubController.getInstallUrl);
githubRouter.post('/webhook', githubController.webhook);

// Protected routes
githubRouter.get('/repos', requireAuth, githubController.getUserRepos);
