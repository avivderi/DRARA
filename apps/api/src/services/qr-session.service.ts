import { randomBytes } from 'node:crypto';

import { redisClient } from '../lib/redis';

const QR_TTL = Number(process.env['QR_SESSION_TTL_SECONDS'] ?? 120);
const KEY_PREFIX = 'qr:session:';

interface QrSessionPayload {
  sessionToken: string;
  createdAt: string;
  userId?: string; // Set after mobile confirms
  confirmed: boolean;
}

export class QrSessionService {
  /** Mobile app calls this to link its account to a web browser session */
  async initSession(): Promise<{ sessionToken: string; qrPayload: string }> {
    const sessionToken = randomBytes(32).toString('hex');
    const payload: QrSessionPayload = {
      sessionToken,
      createdAt: new Date().toISOString(),
      confirmed: false,
    };
    await redisClient.set(`${KEY_PREFIX}${sessionToken}`, JSON.stringify(payload), QR_TTL);

    // The QR payload is what gets encoded in the QR code shown to the user
    const qrPayload = JSON.stringify({ sessionToken, action: 'drara:qr-link' });
    return { sessionToken, qrPayload };
  }

  /** Mobile app scans QR and calls this to confirm, linking the user */
  async confirmSession(sessionToken: string, userId: string): Promise<void> {
    const key = `${KEY_PREFIX}${sessionToken}`;
    const raw = await redisClient.get(key);
    if (!raw) throw new Error('SESSION_NOT_FOUND');

    const session = JSON.parse(raw) as QrSessionPayload;
    if (session.confirmed) throw new Error('SESSION_ALREADY_CONFIRMED');

    const updated: QrSessionPayload = { ...session, userId, confirmed: true };
    // Keep TTL short after confirm — web polls and picks up result
    await redisClient.set(key, JSON.stringify(updated), 30);
  }

  /** Web browser polls this to check if mobile has confirmed */
  async getSession(sessionToken: string): Promise<QrSessionPayload | null> {
    const raw = await redisClient.get(`${KEY_PREFIX}${sessionToken}`);
    if (!raw) return null;
    return JSON.parse(raw) as QrSessionPayload;
  }
}

export const qrSessionService = new QrSessionService();
