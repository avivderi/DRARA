import { AppError } from '../lib/errors';
import type { IRefreshTokenRepository } from '../repositories/refresh-token.repository.interface';
import type { CreateUserInput, IUserRepository, User } from '../repositories/user.repository.interface';

import type { JwtService, TokenPair } from './jwt.service';

export interface OAuthProfile {
  provider: 'google' | 'github';
  providerId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  githubUsername?: string;
}

export interface AuthResult {
  user: User;
  tokens: TokenPair;
}

export class AuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  /** Upsert user from OAuth profile and issue token pair */
  async loginWithOAuth(profile: OAuthProfile): Promise<AuthResult> {
    let user = await this.userRepo.findByProvider(profile.provider, profile.providerId);

    if (!user) {
      // Check if email already registered with different provider
      const existing = await this.userRepo.findByEmail(profile.email);
      if (existing) {
        throw AppError.conflict(
          `Email already registered with ${existing.provider}. Please sign in with ${existing.provider}.`,
          'EMAIL_PROVIDER_CONFLICT',
        );
      }

      const createInput: CreateUserInput = {
        name: profile.name,
        email: profile.email,
        avatar_url: profile.avatarUrl,
        provider: profile.provider,
        provider_id: profile.providerId,
        githubUsername: profile.githubUsername,
      };
      user = await this.userRepo.create(createInput);
    }

    const tokens = this.jwtService.generateTokenPair(user.id, user.email);
    await this.refreshTokenRepo.create({
      user_id: user.id,
      token_hash: tokens.refreshTokenHash,
      expires_at: tokens.refreshTokenExpiresAt,
    });

    return { user, tokens };
  }

  /** Rotate refresh token — old token is revoked, new pair issued */
  async refreshTokens(rawRefreshToken: string): Promise<TokenPair> {
    const hash = this.jwtService.hashToken(rawRefreshToken);
    const stored = await this.refreshTokenRepo.findByHash(hash);

    if (!stored) throw AppError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    if (stored.revoked_at) throw AppError.unauthorized('Refresh token revoked', 'TOKEN_REVOKED');
    if (stored.expires_at < new Date()) throw AppError.unauthorized('Refresh token expired', 'TOKEN_EXPIRED');

    const user = await this.userRepo.findById(stored.user_id);
    if (!user) throw AppError.unauthorized('User not found', 'USER_NOT_FOUND');

    // Revoke old token (rotation)
    await this.refreshTokenRepo.revoke(hash);

    // Issue new pair
    const newTokens = this.jwtService.generateTokenPair(user.id, user.email);
    await this.refreshTokenRepo.create({
      user_id: user.id,
      token_hash: newTokens.refreshTokenHash,
      expires_at: newTokens.refreshTokenExpiresAt,
    });

    return newTokens;
  }

  /** Logout — revoke the refresh token */
  async logout(rawRefreshToken: string): Promise<void> {
    const hash = this.jwtService.hashToken(rawRefreshToken);
    await this.refreshTokenRepo.revoke(hash);
  }
}
