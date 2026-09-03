import type { Knex } from 'knex';

import type {
  CreateRefreshTokenInput,
  IRefreshTokenRepository,
  RefreshToken,
} from './refresh-token.repository.interface';

export class KnexRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly db: Knex) {}

  async create(input: CreateRefreshTokenInput): Promise<RefreshToken> {
    const [token] = await this.db<RefreshToken>('refresh_tokens')
      .insert(input)
      .returning('*');
    if (!token) throw new Error('Failed to create refresh token');
    return token;
  }

  async findByHash(tokenHash: string): Promise<RefreshToken | null> {
    const token = await this.db<RefreshToken>('refresh_tokens')
      .where({ token_hash: tokenHash })
      .first();
    return token ?? null;
  }

  async revoke(tokenHash: string): Promise<void> {
    await this.db<RefreshToken>('refresh_tokens')
      .where({ token_hash: tokenHash })
      .update({ revoked_at: this.db.fn.now() });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.db<RefreshToken>('refresh_tokens')
      .where({ user_id: userId, revoked_at: null })
      .update({ revoked_at: this.db.fn.now() });
  }

  async deleteExpired(): Promise<number> {
    return this.db<RefreshToken>('refresh_tokens')
      .where('expires_at', '<', new Date())
      .delete();
  }
}
