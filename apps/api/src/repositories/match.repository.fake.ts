import crypto from 'crypto';

import type {
  CreateMatchInput,
  IMatchRepository,
  Match,
  MatchStatus,
} from './match.repository.interface';

export class FakeMatchRepository implements IMatchRepository {
  private matches: Match[] = [];

  async create(input: CreateMatchInput): Promise<Match> {
    const match: Match = {
      id: crypto.randomUUID(),
      idea_id: input.idea_id,
      user1_id: input.user1_id,
      user2_id: input.user2_id,
      status: input.status || 'suggested',
      compatibility_score: input.compatibility_score ?? null,
      compatibility_report: input.compatibility_report ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.matches.push(match);
    return { ...match };
  }

  async findById(id: string): Promise<Match | null> {
    const match = this.matches.find((m) => m.id === id);
    return match ? { ...match } : null;
  }

  async findByIdeaAndUsers(
    ideaId: string,
    user1Id: string,
    user2Id: string,
  ): Promise<Match | null> {
    const match = this.matches.find(
      (m) =>
        m.idea_id === ideaId &&
        ((m.user1_id === user1Id && m.user2_id === user2Id) ||
          (m.user1_id === user2Id && m.user2_id === user1Id)),
    );
    return match ? { ...match } : null;
  }

  async updateStatus(id: string, status: MatchStatus): Promise<Match | null> {
    const index = this.matches.findIndex((m) => m.id === id);
    if (index === -1) return null;

    this.matches[index] = {
      ...this.matches[index],
      status,
      updated_at: new Date(),
    };
    return { ...this.matches[index] };
  }
}
