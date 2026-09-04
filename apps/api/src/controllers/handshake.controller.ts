import type { Request, Response, NextFunction } from 'express';

import { HandshakeService } from '../services/handshake.service';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export class HandshakeController {
  constructor(private readonly handshakeService: HandshakeService) {}

  private getUserId(req: Request): string {
    const authReq = req as AuthenticatedRequest;
    const headerUserId =
      typeof req.headers['x-user-id'] === 'string' ? req.headers['x-user-id'] : undefined;
    return authReq.user?.id ?? headerUserId ?? 'anonymous';
  }

  initiateHandshake = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const { matchId } = req.body as { matchId?: string };

      if (!matchId) {
        res.status(400).json({ error: 'Missing matchId parameter' });
        return;
      }

      const result = await this.handshakeService.initiateHandshake(matchId, userId);
      res.json(result);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.message.includes('not found') || error.message.includes('not a participant')) {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  verifyHandshake = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const { matchId, challengeToken, nfcTokenSignature, locationHash, permissionsGranted } =
        req.body as {
          matchId?: string;
          challengeToken?: string;
          nfcTokenSignature?: string;
          locationHash?: string;
          permissionsGranted?: string[];
        };

      if (!matchId || !challengeToken || !nfcTokenSignature || !locationHash) {
        res.status(400).json({
          error:
            'Missing required parameters: matchId, challengeToken, nfcTokenSignature, locationHash',
        });
        return;
      }

      const result = await this.handshakeService.verifyHandshake({
        matchId,
        signerUserId: userId,
        challengeToken,
        nfcTokenSignature,
        locationHash,
        permissionsGranted,
      });

      res.json(result);
    } catch (err: unknown) {
      const error = err as Error;
      if (
        error.message.includes('expired') ||
        error.message.includes('Invalid') ||
        error.message.includes('Initiator cannot be the signer')
      ) {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  getHandshakeStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const matchId = req.params['matchId'];

      if (!matchId) {
        res.status(400).json({ error: 'Missing matchId parameter' });
        return;
      }

      const result = await this.handshakeService.getHandshakeStatus(matchId, userId);
      res.json(result);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.message.includes('not found') || error.message.includes('not a participant')) {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  };
}
