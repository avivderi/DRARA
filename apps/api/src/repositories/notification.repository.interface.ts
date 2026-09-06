export interface NotificationRecord {
  id: string;
  user_id: string;
  type: string; // 'new_match' | 'new_message' | 'handshake_confirmed' | 'scan_completed'
  payload: Record<string, unknown>;
  read_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface INotificationRepository {
  create(userId: string, type: string, payload: Record<string, unknown>): Promise<NotificationRecord>;
  findByUserId(userId: string, limit?: number, offset?: number): Promise<NotificationRecord[]>;
  countUnread(userId: string): Promise<number>;
  markAsRead(id: string, userId: string): Promise<NotificationRecord | null>;
  markAllAsRead(userId: string): Promise<number>;
}
