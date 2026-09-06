import {
  INotificationRepository,
  NotificationRecord,
} from '../repositories/notification.repository.interface';

export class NotificationService {
  constructor(private notificationRepo: INotificationRepository) {}

  async createNotification(
    userId: string,
    type: string,
    payload: Record<string, unknown>
  ): Promise<NotificationRecord> {
    return this.notificationRepo.create(userId, type, payload);
  }

  async getUserNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ unread_count: number; notifications: NotificationRecord[] }> {
    const notifications = await this.notificationRepo.findByUserId(userId, limit, offset);
    const unread_count = await this.notificationRepo.countUnread(userId);

    return {
      unread_count,
      notifications,
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<NotificationRecord> {
    const notification = await this.notificationRepo.markAsRead(notificationId, userId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  }

  async markAllAsRead(userId: string): Promise<{ marked_read: number }> {
    const count = await this.notificationRepo.markAllAsRead(userId);
    return { marked_read: count };
  }
}
