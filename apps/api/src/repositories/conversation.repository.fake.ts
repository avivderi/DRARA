import {
  ConversationRecord,
  ConversationSummary,
  IConversationRepository,
} from './conversation.repository.interface';

export class FakeConversationRepository implements IConversationRepository {
  public conversations: ConversationRecord[] = [];

  async findByMatchId(matchId: string): Promise<ConversationRecord | null> {
    return this.conversations.find((c) => c.match_id === matchId) || null;
  }

  async findById(id: string): Promise<ConversationRecord | null> {
    return this.conversations.find((c) => c.id === id) || null;
  }

  async create(matchId: string): Promise<ConversationRecord> {
    const record: ConversationRecord = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      match_id: matchId,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.conversations.push(record);
    return record;
  }

  async findUserConversations(_userId: string): Promise<ConversationSummary[]> {
    return this.conversations.map((c) => ({
      id: c.id,
      match_id: c.match_id,
      idea_id: 'fake-idea-id',
      idea_title: 'Fake Idea Title',
      partner_id: 'fake-partner-id',
      partner_name: 'Fake Partner',
      partner_avatar: null,
      last_message: 'Sample last message',
      last_message_at: new Date(),
      unread_count: 0,
      match_status: 'intro',
      is_nfc_confirmed: false,
      created_at: c.created_at,
    }));
  }
}
