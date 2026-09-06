import type { Knex } from 'knex';

import { IMessageRepository, MessageRecord } from './message.repository.interface';

export class MessageRepository implements IMessageRepository {
  constructor(private db: Knex) {}

  async create(conversationId: string, senderId: string, content: string): Promise<MessageRecord> {
    const [row] = await this.db<MessageRecord>('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
      })
      .returning('*');

    // Touch conversation updated_at
    await this.db('conversations')
      .where({ id: conversationId })
      .update({ updated_at: this.db.fn.now() });

    return row as MessageRecord;
  }

  async findPaginated(conversationId: string, limit: number, offset: number): Promise<MessageRecord[]> {
    const rows = await this.db<MessageRecord>('messages')
      .where({ conversation_id: conversationId })
      .orderBy('created_at', 'asc')
      .limit(limit)
      .offset(offset);

    return rows;
  }

  async markAsRead(conversationId: string, userId: string): Promise<number> {
    const count = await this.db('messages')
      .where({ conversation_id: conversationId })
      .whereNot({ sender_id: userId })
      .whereNull('read_at')
      .update({ read_at: this.db.fn.now() });

    return count;
  }

  async countUnread(conversationId: string, userId: string): Promise<number> {
    const [res] = await this.db('messages')
      .where({ conversation_id: conversationId })
      .whereNot({ sender_id: userId })
      .whereNull('read_at')
      .count();

    const countVal = res?.['count'];
    return Number(countVal || 0);
  }
}
