import type { Knex } from 'knex';

import type {
  CreateUserInput,
  IUserRepository,
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
    if (input.skills) {
      updateData['skills'] = this.db.raw('?::text[]', [input.skills]);
    }
    if (input.offering_tags) {
      updateData['offering_tags'] = this.db.raw('?::text[]', [input.offering_tags]);
    }
    if (input.seeking_tags) {
      updateData['seeking_tags'] = this.db.raw('?::text[]', [input.seeking_tags]);
    }
    const [user] = await this.db<User>('users')
      .where({ id })
      .update(updateData as Partial<User>)
      .returning('*');
    return user ?? null;
  }

  async updateEmbeddings(id: string, offeringVector?: number[], seekingVector?: number[]): Promise<void> {
    const updates: Record<string, unknown> = { updated_at: this.db.fn.now() };
    if (offeringVector && offeringVector.length > 0) {
      updates['offering_embedding'] = this.db.raw('?::vector', [JSON.stringify(offeringVector)]);
    }
    if (seekingVector && seekingVector.length > 0) {
      updates['seeking_embedding'] = this.db.raw('?::vector', [JSON.stringify(seekingVector)]);
    }
    await this.db('users').where({ id }).update(updates);
  }
}
