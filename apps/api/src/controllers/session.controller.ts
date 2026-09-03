import type { Request, Response } from 'express';

import { AppError } from '../lib/errors';
import { qrSessionService } from '../services/qr-session.service';

export const sessionController = {
  /** Web app calls this — gets back a session token + QR payload to display */
  qrInit: async (_req: Request, res: Response): Promise<void> => {
    const { sessionToken, qrPayload } = await qrSessionService.initSession();
    res.json({ session_token: sessionToken, qr_payload: qrPayload });
  },

  /** Mobile app calls this after scanning QR — must be authenticated */
  qrConfirm: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const { session_token } = req.body as { session_token?: string };
    if (!session_token) throw AppError.badRequest('session_token is required');

    try {
      await qrSessionService.confirmSession(session_token, userId);
      res.json({ confirmed: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'SESSION_NOT_FOUND') throw AppError.notFound('QR session not found or expired', 'QR_SESSION_NOT_FOUND');
      if (msg === 'SESSION_ALREADY_CONFIRMED') throw AppError.conflict('Session already confirmed', 'QR_ALREADY_CONFIRMED');
      throw err;
    }
  },

  /** Web app polls this to check if mobile has confirmed */
  qrStatus: async (req: Request, res: Response): Promise<void> => {
    const { session_token } = req.params as { session_token?: string };
    if (!session_token) throw AppError.badRequest('session_token is required');

    const session = await qrSessionService.getSession(session_token);
    if (!session) throw AppError.notFound('QR session not found or expired', 'QR_SESSION_NOT_FOUND');

    res.json({ confirmed: session.confirmed, user_id: session.userId ?? null });
  },
};
