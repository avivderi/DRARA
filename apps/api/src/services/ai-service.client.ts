import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';

export interface AIScanRequestPayload {
  github_repo_full_name: string;
  installation_id: string;
  installation_token?: string;
  force?: boolean;
}

export interface AIScanResponsePayload {
  ai_summary: string;
  stack_detected: string[];
  readiness_score: number;
  readiness_rationale: string;
  tokens_used: number;
  estimated_cost_usd: number;
}

export class AIServiceClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env['AI_SERVICE_URL'] ?? 'http://localhost:8000';
  }

  async scanRepository(payload: AIScanRequestPayload): Promise<AIScanResponsePayload> {
    const isEnabled = process.env['GITHUB_AI_SCAN_ENABLED'] !== 'false';
    if (!isEnabled) {
      throw AppError.badRequest(
        'GITHUB_AI_SCAN_DISABLED: AI scanning is disabled. Please provide a manual description.',
        'FEATURE_DISABLED',
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        logger.error({ status: response.status, body: errText }, 'AI microservice returned error');
        throw AppError.internal('AI scanning service failed');
      }

      const result = (await response.json()) as AIScanResponsePayload;
      logger.info(
        {
          repo: payload.github_repo_full_name,
          tokens: result.tokens_used,
          cost: result.estimated_cost_usd,
        },
        'AI scan completed',
      );
      return result;
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      logger.error({ err }, 'Failed to communicate with AI microservice');
      throw AppError.internal('Unable to connect to AI scanning service');
    }
  }

  async generateEmbedding(payload: {
    text?: string;
    tags?: string[];
    bio?: string;
    input_type?: 'query' | 'document';
  }): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        logger.error({ status: response.status, body: errText }, 'AI embedding service returned error');
        throw AppError.internal('AI embedding service failed');
      }

      const result = (await response.json()) as { embedding: number[]; dimension: number };
      return result.embedding;
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      logger.error({ err }, 'Failed to communicate with AI embedding service');
      throw AppError.internal('Unable to connect to AI embedding service');
    }
  }
}

