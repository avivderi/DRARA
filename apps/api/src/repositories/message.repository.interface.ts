export interface MessageRecord {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface IMessageRepository {
  create(conversationId: string, senderId: string, content: string): Promise<MessageRecord>;
  findPaginated(conversationId: string, limit: number, offset: number): Promise<MessageRecord[]>;
  markAsRead(conversationId: string, userId: string): Promise<number>;
  countUnread(conversationId: string, userId: string): Promise<number>;
}
