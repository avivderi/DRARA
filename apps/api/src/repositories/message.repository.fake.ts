import { IMessageRepository, MessageRecord } from './message.repository.interface';

export class FakeMessageRepository implements IMessageRepository {
  public messages: MessageRecord[] = [];

  async create(conversationId: string, senderId: string, content: string): Promise<MessageRecord> {
    const record: MessageRecord = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      read_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.messages.push(record);
    return record;
  }

  async findPaginated(conversationId: string, limit: number, offset: number): Promise<MessageRecord[]> {
    return this.messages
      .filter((m) => m.conversation_id === conversationId)
      .slice(offset, offset + limit);
  }

  async markAsRead(conversationId: string, userId: string): Promise<number> {
    let count = 0;
    for (const m of this.messages) {
      if (m.conversation_id === conversationId && m.sender_id !== userId && !m.read_at) {
        m.read_at = new Date();
        count++;
      }
    }
    return count;
  }

  async countUnread(conversationId: string, userId: string): Promise<number> {
    return this.messages.filter(
      (m) => m.conversation_id === conversationId && m.sender_id !== userId && !m.read_at
    ).length;
  }
}
