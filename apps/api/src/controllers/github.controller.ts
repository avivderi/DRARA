import type { Request, Response } from 'express';

import { db } from '../db/connection';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { KnexConnectedRepoRepository } from '../repositories/connected-repo.repository';

export const githubController = {
  /** Returns URL to install DRARA GitHub App on repositories */
  getInstallUrl: async (_req: Request, res: Response): Promise<void> => {
    const appName = process.env['GITHUB_APP_NAME'] ?? 'drara-app';
    const installUrl = `https://github.com/apps/${appName}/installations/new`;
    res.json({ install_url: installUrl });
  },

  /** GitHub App Webhook handler — receives installation events */
  webhook: async (req: Request, res: Response): Promise<void> => {
    const event = req.headers['x-github-event'];
    const payload = req.body as {
      action?: string;
      installation?: { id: number };
      repositories_added?: { full_name: string }[];
      repositories_removed?: { full_name: string }[];
    };

    logger.info({ event, action: payload.action }, 'GitHub App webhook received');

    if (event === 'installation' || event === 'installation_repositories') {
      const installationId = String(payload.installation?.id ?? '');
      logger.info({ installationId, action: payload.action }, 'GitHub App installation updated');
    }

    res.status(200).json({ received: true });
  },

  /** Returns connected repositories for current authenticated user */
  getUserRepos: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const connectedRepoRepo = new KnexConnectedRepoRepository(db);
    const repos = await connectedRepoRepo.findByUserId(userId);
    res.json(repos);
  },
};
