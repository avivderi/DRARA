import { randomUUID } from 'node:crypto';

import type {
  CreateRefreshTokenInput,
  IRefreshTokenRepository,
  RefreshToken,
} from './refresh-token.repository.interface';

export class FakeRefreshTokenRepository implements IRefreshTokenRepository {
  private readonly store = new Map<string, RefreshToken>();

  async create(input: CreateRefreshTokenInput): Promise<RefreshToken> {
    const token: RefreshToken = {
      id: randomUUID(),
      ...input,
      revoked_at: null,
      created_at: new Date(),
    };
    this.store.set(token.token_hash, token);
    return structuredClone(token);
  }

  async findByHash(tokenHash: string): Promise<RefreshToken | null> {
    const token = this.store.get(tokenHash);
    return token ? structuredClone(token) : null;
  }

  async revoke(tokenHash: string): Promise<void> {
    const token = this.store.get(tokenHash);
    if (token) {
      this.store.set(tokenHash, { ...token, revoked_at: new Date() });
    }
  }

  async revokeAllForUser(userId: string): Promise<void> {
    for (const [hash, token] of this.store.entries()) {
      if (token.user_id === userId && !token.revoked_at) {
        this.store.set(hash, { ...token, revoked_at: new Date() });
      }
    }
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();
    let count = 0;
    for (const [hash, token] of this.store.entries()) {
      if (token.expires_at < now) {
        this.store.delete(hash);
        count++;
      }
    }
    return count;
  }

  clear(): void { this.store.clear(); }
  all(): RefreshToken[] { return [...this.store.values()].map((t) => structuredClone(t)); }
}
