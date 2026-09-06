import { Router, Request, Response } from 'express';
import type { Knex } from 'knex';
import { z } from 'zod';

import { requireAuth } from '../middleware/auth.middleware';
import { ConversationRepository } from '../repositories/conversation.repository';
import { KnexMatchRepository } from '../repositories/match.repository';
import { MessageRepository } from '../repositories/message.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { MessagingService } from '../services/messaging.service';

export function createConversationsRouter(db: Knex): Router {
  const router = Router();

  const conversationRepo = new ConversationRepository(db);
  const messageRepo = new MessageRepository(db);
  const matchRepo = new KnexMatchRepository(db);
  const notificationRepo = new NotificationRepository(db);

  const messagingService = new MessagingService(
    conversationRepo,
    messageRepo,
    matchRepo,
    notificationRepo
  );

  const sendMessageSchema = z.object({
    content: z.string().min(1, 'Message cannot be empty').max(2000),
  });

  // GET /conversations — Fetch active user inbox conversations
  router.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw new Error('Unauthorized');
    const conversations = await messagingService.getConversationsForUser(userId);
    res.json({ conversations });
  });

  // GET /conversations/:threadId/messages — Fetch paginated chat messages for a conversation
  router.get('/:threadId/messages', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw new Error('Unauthorized');
    const threadId = req.params['threadId']!;
    const limit = Math.min(Number(req.query['limit'] || 50), 100);
    const offset = Math.max(Number(req.query['offset'] || 0), 0);

    const result = await messagingService.getMessages(threadId, userId, limit, offset);
    res.json(result);
  });

  // POST /conversations/:threadId/messages — Send a new chat message
  router.post('/:threadId/messages', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw new Error('Unauthorized');
    const threadId = req.params['threadId']!;
    const body = sendMessageSchema.parse(req.body);

    const message = await messagingService.sendMessage(threadId, userId, body.content);
    res.status(201).json({ message });
  });

  // POST /conversations/matches/:matchId/intro — Send initial Intro message and start conversation
  router.post('/matches/:matchId/intro', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw new Error('Unauthorized');
    const matchId = req.params['matchId']!;
    const bodyContent = (req.body as Record<string, unknown> | undefined)?.['content'];
    const content = bodyContent ? String(bodyContent) : undefined;

    const result = await messagingService.sendMatchIntro(matchId, userId, content);
    res.status(201).json(result);
  });

  return router;
}
