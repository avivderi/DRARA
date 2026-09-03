import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';

export interface EmbeddingResult {
  embedding: number[];
  dimensions: number;
  tokens_used: number;
}

export class EmbeddingServiceClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env['AI_SERVICE_URL'] ?? 'http://localhost:8000';
  }

  /**
   * Calls FastAPI POST /embed endpoint to convert text or tags into 1024-dim vector
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        logger.error({ status: response.status }, 'Embedding service request failed');
        throw AppError.internal('Embedding service communication failed', 'EMBEDDING_SERVICE_ERROR');
      }

      const data = (await response.json()) as EmbeddingResult;
      return data.embedding;
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      logger.error({ err }, 'Error communicating with AI embedding service');
      throw AppError.internal('Failed to generate embedding vector', 'EMBEDDING_SERVICE_ERROR');
    }
  }
}
