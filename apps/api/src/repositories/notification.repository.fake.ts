import {
  INotificationRepository,
  NotificationRecord,
} from './notification.repository.interface';

export class FakeNotificationRepository implements INotificationRepository {
  public notifications: NotificationRecord[] = [];

  async create(userId: string, type: string, payload: Record<string, unknown>): Promise<NotificationRecord> {
    const record: NotificationRecord = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      type,
      payload,
      read_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.notifications.push(record);
    return record;
  }

  async findByUserId(userId: string, limit: number = 20, offset: number = 0): Promise<NotificationRecord[]> {
    return this.notifications
      .filter((n) => n.user_id === userId)
      .slice(offset, offset + limit);
  }

  async countUnread(userId: string): Promise<number> {
    return this.notifications.filter((n) => n.user_id === userId && !n.read_at).length;
  }

  async markAsRead(id: string, userId: string): Promise<NotificationRecord | null> {
    const notif = this.notifications.find((n) => n.id === id && n.user_id === userId);
    if (notif) {
      notif.read_at = new Date();
      return notif;
    }
    return null;
  }

  async markAllAsRead(userId: string): Promise<number> {
    let count = 0;
    for (const n of this.notifications) {
      if (n.user_id === userId && !n.read_at) {
        n.read_at = new Date();
        count++;
      }
    }
    return count;
  }
}
