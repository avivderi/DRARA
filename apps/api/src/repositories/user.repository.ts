import type { Knex } from 'knex';

import type {
  CreateUserInput,
  IUserRepository,
  MatchedUserCandidate,
  UpdateUserInput,
  User,
  UserProvider,
} from './user.repository.interface';

export class KnexUserRepository implements IUserRepository {
  constructor(private readonly db: Knex) {}

  async create(input: CreateUserInput): Promise<User> {
    const [user] = await this.db<User>('users')
      .insert({
        name: input.name,
        email: input.email,
        avatar_url: input.avatar_url,
        provider: input.provider,
        provider_id: input.provider_id,
        github_username: input.githubUsername ?? null,
        skills: this.db.raw('ARRAY[]::text[]'),
      })
      .returning('*');

    if (!user) throw new Error('Failed to create user');
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db<User>('users').where({ id }).first();
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db<User>('users').where({ email }).first();
    return user ?? null;
  }

  async findByProvider(provider: UserProvider, providerId: string): Promise<User | null> {
    const user = await this.db<User>('users')
      .where({ provider, provider_id: providerId })
      .first();
    return user ?? null;
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const updateData: Record<string, unknown> = { ...input, updated_at: this.db.fn.now() };

    if (input.offering_embedding) {
      updateData['offering_embedding'] = `[${input.offering_embedding.join(',')}]`;
    }
    if (input.seeking_embedding) {
      updateData['seeking_embedding'] = `[${input.seeking_embedding.join(',')}]`;
    }

    const [user] = await this.db<User>('users')
      .where({ id })
      .update(updateData)
      .returning('*');
    return user ?? null;
  }

  async findMatchingUsersForOfferingVector(
    seekingVector: number[] | string,
    excludeUserId: string,
    limit: number = 10,
  ): Promise<MatchedUserCandidate[]> {
    const vectorStr =
      typeof seekingVector === 'string'
        ? seekingVector
        : Array.isArray(seekingVector)
        ? `[${seekingVector.join(',')}]`
        : String(seekingVector);

    const queryResult = (await this.db.raw(
      `SELECT *, (1 - (offering_embedding <=> ?::vector)) AS similarity_score
       FROM users
       WHERE id != ? AND offering_embedding IS NOT NULL
       ORDER BY offering_embedding <=> ?::vector ASC
       LIMIT ?`,
      [vectorStr, excludeUserId, vectorStr, limit],
    )) as { rows?: Array<User & { similarity_score: string | number }> } | Array<User & { similarity_score: string | number }>;

    const rawList = Array.isArray(queryResult) ? queryResult : queryResult.rows ?? [];

    const candidates: MatchedUserCandidate[] = rawList.map((row) => ({
      user: row as User,
      similarityScore: typeof row.similarity_score === 'number' ? row.similarity_score : parseFloat(String(row.similarity_score)),
    }));

    return candidates;
  }
}
