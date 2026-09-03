import { Router } from 'express';

import { sessionController } from '../controllers/session.controller';
import { requireAuth } from '../middleware/auth.middleware';

export const sessionRouter = Router();

// Web calls this — no auth needed (creates anonymous session to link)
sessionRouter.post('/qr-init', sessionController.qrInit);

// Mobile calls this — must be authenticated
sessionRouter.post('/qr-confirm', requireAuth, sessionController.qrConfirm);

// Web polls this to check status
sessionRouter.get('/qr-status/:session_token', sessionController.qrStatus);
