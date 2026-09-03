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
    const [user] = await this.db<User>('users')
      .where({ id })
      .update({ ...input, updated_at: this.db.fn.now() })
      .returning('*');
    return user ?? null;
  }
}
