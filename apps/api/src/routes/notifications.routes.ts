import { Router, Request, Response } from 'express';
import type { Knex } from 'knex';

import { requireAuth } from '../middleware/auth.middleware';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationService } from '../services/notification.service';

export function createNotificationsRouter(db: Knex): Router {
  const router = Router();

  const notificationRepo = new NotificationRepository(db);
  const notificationService = new NotificationService(notificationRepo);

  // GET /notifications — Get user notifications list & unread count
  router.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw new Error('Unauthorized');
    const limit = Math.min(Number(req.query['limit'] || 20), 100);
    const offset = Math.max(Number(req.query['offset'] || 0), 0);

    const result = await notificationService.getUserNotifications(userId, limit, offset);
    res.json(result);
  });

  // PATCH /notifications/:id/read — Mark single notification read
  router.patch('/:id/read', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw new Error('Unauthorized');
    const notificationId = req.params['id']!;

    const notification = await notificationService.markAsRead(notificationId, userId);
    res.json({ notification });
  });

  // PATCH /notifications/read-all — Mark all user notifications read
  router.patch('/read-all', requireAuth, async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw new Error('Unauthorized');

    const result = await notificationService.markAllAsRead(userId);
    res.json(result);
  });

  return router;
}
