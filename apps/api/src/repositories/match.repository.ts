import type { Knex } from 'knex';

import type {
  CreateMatchInput,
  IMatchRepository,
  Match,
  MatchStatus,
} from './match.repository.interface';

export class KnexMatchRepository implements IMatchRepository {
  constructor(private readonly db: Knex) {}

  async create(input: CreateMatchInput): Promise<Match> {
    const [match] = await this.db<Match>('matches')
      .insert({
        idea_id: input.idea_id,
        user1_id: input.user1_id,
        user2_id: input.user2_id,
        status: input.status ?? 'suggested',
        compatibility_score: input.compatibility_score ?? null,
        compatibility_report: input.compatibility_report ?? null,
      })
      .returning('*');

    if (!match) throw new Error('Failed to create match');
    return match;
  }

  async findById(id: string): Promise<Match | null> {
    const match = await this.db<Match>('matches').where({ id }).first();
    return match ?? null;
  }

  async findByIdeaAndUsers(
    ideaId: string,
    user1Id: string,
    user2Id: string,
  ): Promise<Match | null> {
    const match = await this.db<Match>('matches')
      .where({ idea_id: ideaId })
      .andWhere((builder) => {
        void builder
          .where({ user1_id: user1Id, user2_id: user2Id })
          .orWhere({ user1_id: user2Id, user2_id: user1Id });
      })
      .first();
    return match ?? null;
  }

  async updateStatus(id: string, status: MatchStatus): Promise<Match | null> {
    const [updated] = await this.db<Match>('matches')
      .where({ id })
      .update({
        status,
        updated_at: this.db.fn.now(),
      })
      .returning('*');
    return updated ?? null;
  }
}
