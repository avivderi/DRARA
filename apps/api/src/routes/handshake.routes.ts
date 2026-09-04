import { Router } from 'express';

import { HandshakeController } from '../controllers/handshake.controller';
import { db } from '../db/connection';
import { requireAuth } from '../middleware/auth.middleware';
import { KnexHandshakeEventRepository } from '../repositories/handshake-event.repository';
import { KnexMatchRepository } from '../repositories/match.repository';
import { KnexUserRepository } from '../repositories/user.repository';
import { HandshakeService } from '../services/handshake.service';

const matchRepo = new KnexMatchRepository(db);
const handshakeEventRepo = new KnexHandshakeEventRepository(db);
const userRepo = new KnexUserRepository(db);
const handshakeService = new HandshakeService(matchRepo, handshakeEventRepo, userRepo);
const handshakeController = new HandshakeController(handshakeService);

export const handshakeRouter = Router();

handshakeRouter.use(requireAuth);

handshakeRouter.post('/initiate', handshakeController.initiateHandshake);
handshakeRouter.post('/verify', handshakeController.verifyHandshake);
handshakeRouter.get('/status/:matchId', handshakeController.getHandshakeStatus);
