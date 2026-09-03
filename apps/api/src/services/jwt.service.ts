import { createHash, randomBytes } from 'node:crypto';
import fs from 'node:fs';

import jwt from 'jsonwebtoken';

export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
  iat: number;
  exp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string; // raw (not hashed) — caller stores the hash
  refreshTokenHash: string;
  refreshTokenExpiresAt: Date;
}

export class JwtService {
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;

  constructor() {
    const privatePath = process.env['JWT_PRIVATE_KEY_PATH'] ?? './keys/private.pem';
    const publicPath = process.env['JWT_PUBLIC_KEY_PATH'] ?? './keys/public.pem';

    this.privateKey = fs.readFileSync(privatePath, 'utf-8');
    this.publicKey = fs.readFileSync(publicPath, 'utf-8');
    this.accessTokenExpiresIn = process.env['JWT_ACCESS_TOKEN_EXPIRES_IN'] ?? '15m';
    this.refreshTokenExpiresIn = process.env['JWT_REFRESH_TOKEN_EXPIRES_IN'] ?? '30d';
  }

  signAccessToken(userId: string, email: string): string {
    return jwt.sign({ sub: userId, email }, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: this.accessTokenExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] }) as AccessTokenPayload;
  }

  generateTokenPair(userId: string, email: string): TokenPair {
    const accessToken = this.signAccessToken(userId, email);
    const rawRefresh = randomBytes(64).toString('hex');
    const refreshTokenHash = createHash('sha256').update(rawRefresh).digest('hex');
    const expiresAt = this.parseExpiresIn(this.refreshTokenExpiresIn);

    return {
      accessToken,
      refreshToken: rawRefresh,
      refreshTokenHash,
      refreshTokenExpiresAt: expiresAt,
    };
  }

  hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private parseExpiresIn(expiresIn: string): Date {
    const now = new Date();
    const match = /^(\d+)([smhd])$/.exec(expiresIn);
    if (!match) throw new Error(`Invalid expiresIn format: ${expiresIn}`);
    const [, value, unit] = match;
    const ms = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit as 's' | 'm' | 'h' | 'd'];
    now.setTime(now.getTime() + Number(value) * ms);
    return now;
  }
}

export const jwtService = new JwtService();
