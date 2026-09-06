import type { Knex } from 'knex';

import {
  INotificationRepository,
  NotificationRecord,
} from './notification.repository.interface';

export class NotificationRepository implements INotificationRepository {
  constructor(private db: Knex) {}

  async create(userId: string, type: string, payload: Record<string, unknown>): Promise<NotificationRecord> {
    const rows = await this.db('notifications')
      .insert({
        user_id: userId,
        type,
        payload: JSON.stringify(payload),
      })
      .returning('*');

    const row = rows[0] as unknown as NotificationRecord | undefined;
    if (!row) throw new Error('Failed to create notification');
    return row;
  }

  async findByUserId(userId: string, limit: number = 20, offset: number = 0): Promise<NotificationRecord[]> {
    const rows = await this.db<NotificationRecord>('notifications')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return rows;
  }

  async countUnread(userId: string): Promise<number> {
    const countRes = await this.db('notifications')
      .where({ user_id: userId })
      .whereNull('read_at')
      .count();

    const first = Array.isArray(countRes) ? countRes[0] : null;
    const countVal = first ? first['count'] : 0;
    return Number(countVal || 0);
  }

  async markAsRead(id: string, userId: string): Promise<NotificationRecord | null> {
    const rows = await this.db<NotificationRecord>('notifications')
      .where({ id, user_id: userId })
      .update({ read_at: this.db.fn.now() })
      .returning('*');

    return rows[0] ?? null;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const count = await this.db('notifications')
      .where({ user_id: userId })
      .whereNull('read_at')
      .update({ read_at: this.db.fn.now() });

    return count;
  }
}
