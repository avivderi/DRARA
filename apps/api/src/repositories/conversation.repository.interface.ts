export interface ConversationRecord {
  id: string;
  match_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ConversationSummary {
  id: string;
  match_id: string;
  idea_id: string;
  idea_title: string;
  partner_id: string;
  partner_name: string;
  partner_avatar: string | null;
  last_message: string | null;
  last_message_at: Date | null;
  unread_count: number;
  match_status: string;
  is_nfc_confirmed: boolean;
  created_at: Date;
}

export interface IConversationRepository {
  findByMatchId(matchId: string): Promise<ConversationRecord | null>;
  findById(id: string): Promise<ConversationRecord | null>;
  create(matchId: string): Promise<ConversationRecord>;
  findUserConversations(userId: string): Promise<ConversationSummary[]>;
}
