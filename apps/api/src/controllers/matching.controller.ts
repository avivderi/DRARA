import type { Request, Response, NextFunction } from 'express';

import { MatchingService, type MatchResult } from '../services/matching.service';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export class MatchingController {
  private readonly matchingService: MatchingService;

  constructor(matchingService: MatchingService) {
    this.matchingService = matchingService;
  }

  getIdeaMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ideaId = req.params['id'];
      if (!ideaId) {
        res.status(400).json({ error: 'Missing idea ID' });
        return;
      }

      const authReq = req as AuthenticatedRequest;
      const headerUserId = typeof req.headers['x-user-id'] === 'string' ? req.headers['x-user-id'] : undefined;
      const userId = authReq.user?.id ?? headerUserId ?? 'anonymous';
      const limitParam = typeof req.query['limit'] === 'string' ? req.query['limit'] : undefined;
      const limit = limitParam ? parseInt(limitParam, 10) : 10;

      const matches: MatchResult[] = await this.matchingService.getMatchesForIdea(userId, ideaId, limit);
      res.json({ ideaId, count: matches.length, matches });
    } catch (err: unknown) {
      next(err as Error);
    }
  };
}
