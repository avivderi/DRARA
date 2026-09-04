export type MatchStatus =
  | 'suggested'
  | 'intro'
  | 'deep_dive'
  | 'pending_handshake'
  | 'confirmed'
  | 'rejected';

export interface Match {
  id: string;
  idea_id: string;
  user1_id: string;
  user2_id: string;
  status: MatchStatus;
  compatibility_score: number | null;
  compatibility_report: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMatchInput {
  idea_id: string;
  user1_id: string;
  user2_id: string;
  status?: MatchStatus;
  compatibility_score?: number | null;
  compatibility_report?: string | null;
}

export interface IMatchRepository {
  create(input: CreateMatchInput): Promise<Match>;
  findById(id: string): Promise<Match | null>;
  findByIdeaAndUsers(ideaId: string, user1Id: string, user2Id: string): Promise<Match | null>;
  updateStatus(id: string, status: MatchStatus): Promise<Match | null>;
}
