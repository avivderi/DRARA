import type { Knex } from 'knex';

import {
  ConversationRecord,
  ConversationSummary,
  IConversationRepository,
} from './conversation.repository.interface';
import { MessageRecord } from './message.repository.interface';

interface RawConversationRow {
  id: string;
  match_id: string;
  idea_id: string;
  idea_title: string;
  partner_id: string;
  partner_name: string | null;
  partner_avatar: string | null;
  match_status: string;
  created_at: Date;
}

export class ConversationRepository implements IConversationRepository {
  constructor(private db: Knex) {}

  async findByMatchId(matchId: string): Promise<ConversationRecord | null> {
    const row = await this.db<ConversationRecord>('conversations')
      .where({ match_id: matchId })
      .first();

    return row ?? null;
  }

  async findById(id: string): Promise<ConversationRecord | null> {
    const row = await this.db<ConversationRecord>('conversations').where({ id }).first();

    return row ?? null;
  }

  async create(matchId: string): Promise<ConversationRecord> {
    const [row] = await this.db<ConversationRecord>('conversations')
      .insert({
        match_id: matchId,
      })
      .returning('*');

    return row as ConversationRecord;
  }

  async findUserConversations(userId: string): Promise<ConversationSummary[]> {
    // Join matches, ideas, users to get conversation metadata
    const rows = (await this.db('conversations as c')
      .join('matches as m', 'c.match_id', 'm.id')
      .join('ideas as i', 'm.idea_id', 'i.id')
      .join('users as u1', 'm.user1_id', 'u1.id')
      .join('users as u2', 'm.user2_id', 'u2.id')
      .where((builder) => {
        void builder.where('m.user1_id', userId).orWhere('m.user2_id', userId);
      })
      .select(
        'c.id as id',
        'c.match_id as match_id',
        'm.idea_id as idea_id',
        'i.title as idea_title',
        'm.status as match_status',
        'c.created_at as created_at',
        this.db.raw(
          `CASE WHEN m.user1_id = ? THEN m.user2_id ELSE m.user1_id END as partner_id`,
          [userId]
        ),
        this.db.raw(
          `CASE WHEN m.user1_id = ? THEN u2.github_username ELSE u1.github_username END as partner_name`,
          [userId]
        ),
        this.db.raw(
          `CASE WHEN m.user1_id = ? THEN u2.avatar_url ELSE u1.avatar_url END as partner_avatar`,
          [userId]
        )
      )
      .orderBy('c.updated_at', 'desc')) as unknown as RawConversationRow[];

    const summaries: ConversationSummary[] = [];

    for (const r of rows) {
      // Fetch last message for conversation
      const lastMsg = await this.db<MessageRecord>('messages')
        .where({ conversation_id: r.id })
        .orderBy('created_at', 'desc')
        .first();

      // Fetch unread count for user (messages sent by partner where read_at is null)
      const [countRes] = await this.db('messages')
        .where({ conversation_id: r.id })
        .whereNot({ sender_id: userId })
        .whereNull('read_at')
        .count();

      const countVal = countRes?.['count'];

      summaries.push({
        id: r.id,
        match_id: r.match_id,
        idea_id: r.idea_id,
        idea_title: r.idea_title,
        partner_id: r.partner_id,
        partner_name: r.partner_name || 'Anonymous User',
        partner_avatar: r.partner_avatar || null,
        last_message: lastMsg ? lastMsg.content : null,
        last_message_at: lastMsg ? lastMsg.created_at : null,
        unread_count: Number(countVal || 0),
        match_status: r.match_status,
        is_nfc_confirmed: r.match_status === 'confirmed',
        created_at: r.created_at,
      });
    }

    return summaries;
  }
}
