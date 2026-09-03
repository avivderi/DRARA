export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string; // SHA-256 of the raw token
  expires_at: Date;
  revoked_at: Date | null;
  created_at: Date;
}

export interface CreateRefreshTokenInput {
  user_id: string;
  token_hash: string;
  expires_at: Date;
}

export interface IRefreshTokenRepository {
  create(input: CreateRefreshTokenInput): Promise<RefreshToken>;
  findByHash(tokenHash: string): Promise<RefreshToken | null>;
  revoke(tokenHash: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  deleteExpired(): Promise<number>; // Returns count of deleted rows
}
