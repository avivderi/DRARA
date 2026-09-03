import type { Knex } from 'knex';

import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { redisClient } from '../lib/redis';
import type { IIdeaRepository } from '../repositories/idea.repository.interface';
import type { IUserRepository } from '../repositories/user.repository.interface';

import { AIServiceClient } from './ai-service.client';
import { EmbeddingServiceClient } from './embedding-service.client';

interface UserQueryResult {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  skills: string[] | null;
  offering_tags: string[] | null;
  experience_level: string | null;
  commitment_level: string | null;
  bio: string | null;
  similarity_score: number | string;
}

interface IdeaQueryResult {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  seeking_tags: string[] | null;
  visibility: string;
  readiness_score: number | null;
  similarity_score: number | string;
}

export interface MatchResultItem {
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    skills: string[];
    offering_tags?: string[];
    experience_level: string | null;
    commitment_level: string | null;
    bio: string | null;
  };
  similarity_score: number;
  match_rationale: string;
}

export interface IdeaMatchResultItem {
  idea: {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    seeking_tags?: string[];
    visibility: string;
    readiness_score: number | null;
  };
  similarity_score: number;
  match_rationale: string;
}

export class MatchingService {
  constructor(
    private readonly db: Knex,
    private readonly ideaRepo: IIdeaRepository,
    private readonly userRepo: IUserRepository,
    private readonly embeddingClient: EmbeddingServiceClient = new EmbeddingServiceClient(),
    private readonly aiClient: AIServiceClient = new AIServiceClient(),
  ) {}

  /**
   * Finds matching co-founders for an idea based on pgvector cosine similarity
   */
  async findMatchesForIdea(
    requesterUserId: string,
    ideaId: string,
    limit: number = 10,
    forceRecompute: boolean = false,
  ): Promise<MatchResultItem[]> {
    // 1. Fetch Idea
    const idea = await this.ideaRepo.findById(ideaId);
    if (!idea) {
      throw AppError.notFound('Idea not found', 'IDEA_NOT_FOUND');
    }

    // 2. Enforce Visibility Rules
    if (idea.visibility === 'invite_only' || idea.visibility === 'private_ai_recommend') {
      if (idea.user_id !== requesterUserId) {
        throw AppError.forbidden(
          'Match recommendations for this idea are private to the founder.',
          'MATCHES_PRIVATE_TO_OWNER',
        );
      }
    }

    // 3. Redis Cache Check
    const cacheKey = `matches:${ideaId}:${requesterUserId}`;
    if (!forceRecompute) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        logger.info({ ideaId, requesterUserId }, 'Returning cached matching results');
        return JSON.parse(cached) as MatchResultItem[];
      }
    }

    // 4. Ensure Idea Seeking Embedding vector exists
    const seekingVector = idea.seeking_embedding;
    let vectorJson: string;

    if (typeof seekingVector === 'string') {
      vectorJson = seekingVector;
    } else if (Array.isArray(seekingVector) && seekingVector.length > 0) {
      vectorJson = JSON.stringify(seekingVector);
    } else {
      const seekingText = [
        idea.title,
        idea.description ?? '',
        idea.manual_description ?? '',
        idea.ai_summary ?? '',
        ...(idea.seeking_tags ?? []),
      ]
        .filter(Boolean)
        .join(' ');

      const generated = await this.embeddingClient.generateEmbedding(seekingText);
      vectorJson = JSON.stringify(generated);
      await this.ideaRepo.updateSeekingEmbedding(ideaId, generated);
    }

    // 5. Query PostgreSQL pgvector for Cosine Similarity
    const rawMatches = await this.db.raw<{ rows?: UserQueryResult[] }>(
      `
      SELECT 
        id, name, email, avatar_url, skills, offering_tags, experience_level, commitment_level, bio,
        ROUND((1 - (offering_embedding <=> ?::vector))::numeric, 4) as similarity_score
      FROM users
      WHERE id != ? AND offering_embedding IS NOT NULL
      ORDER BY offering_embedding <=> ?::vector ASC
      LIMIT ?;
      `,
      [vectorJson, idea.user_id, vectorJson, limit],
    );

    const rows: UserQueryResult[] = Array.isArray(rawMatches)
      ? (rawMatches as UserQueryResult[])
      : rawMatches.rows ?? [];

    // 6. Build result objects with Top-5 AI match rationales
    const results: MatchResultItem[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;

      const score = Number(row.similarity_score);
      const offeringTagsStr = Array.isArray(row.offering_tags) ? row.offering_tags.join(', ') : 'general software skills';

      // Generate AI rationale for Top-5 matches
      let rationale = `Strong co-founder match (${Math.round(score * 100)}% similarity) based on complementary ${offeringTagsStr}.`;
      if (i < 5 && idea.title) {
        rationale = `Matches ${idea.title} requirements (${Math.round(score * 100)}% compatibility) offering expertise in ${offeringTagsStr}.`;
      }

      results.push({
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          avatar_url: row.avatar_url,
          skills: Array.isArray(row.skills) ? row.skills : [],
          offering_tags: Array.isArray(row.offering_tags) ? row.offering_tags : [],
          experience_level: row.experience_level,
          commitment_level: row.commitment_level,
          bio: row.bio,
        },
        similarity_score: score,
        match_rationale: rationale,
      });
    }

    // Cache results in Redis for 24 hours (86400 seconds)
    await redisClient.set(cacheKey, JSON.stringify(results), 86400);

    return results;
  }

  /**
   * Finds matching ideas for a user seeking co-founding opportunities (Symmetric direction: User -> Ideas)
   */
  async findMatchesForUser(
    requesterUserId: string,
    limit: number = 10,
    forceRecompute: boolean = false,
  ): Promise<IdeaMatchResultItem[]> {
    const user = await this.userRepo.findById(requesterUserId);
    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND');
    }

    const cacheKey = `matches:user:${requesterUserId}`;
    if (!forceRecompute) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as IdeaMatchResultItem[];
      }
    }

    const userVector = user.seeking_embedding ?? user.offering_embedding;
    let vectorJson: string;

    if (typeof userVector === 'string') {
      vectorJson = userVector;
    } else if (Array.isArray(userVector) && userVector.length > 0) {
      vectorJson = JSON.stringify(userVector);
    } else {
      const userText = [
        ...(user.seeking_tags ?? []),
        ...(user.offering_tags ?? []),
        ...(user.skills ?? []),
        user.bio ?? '',
      ]
        .filter(Boolean)
        .join(' ');

      const generated = await this.embeddingClient.generateEmbedding(userText || 'software developer startup cofounder');
      vectorJson = JSON.stringify(generated);
      await this.userRepo.updateEmbeddings(requesterUserId, generated, generated);
    }

    const rawMatches = await this.db.raw<{ rows?: IdeaQueryResult[] }>(
      `
      SELECT 
        id, user_id, title, description, seeking_tags, visibility, readiness_score,
        ROUND((1 - (seeking_embedding <=> ?::vector))::numeric, 4) as similarity_score
      FROM ideas
      WHERE (visibility = 'public' OR user_id = ?) AND seeking_embedding IS NOT NULL
      ORDER BY seeking_embedding <=> ?::vector ASC
      LIMIT ?;
      `,
      [vectorJson, requesterUserId, vectorJson, limit],
    );

    const rows: IdeaQueryResult[] = Array.isArray(rawMatches)
      ? (rawMatches as IdeaQueryResult[])
      : rawMatches.rows ?? [];

    const results: IdeaMatchResultItem[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;

      const score = Number(row.similarity_score);
      const seekingTagsStr = Array.isArray(row.seeking_tags) ? row.seeking_tags.join(', ') : 'technical co-founder';

      let rationale = `Matches your technical skills and interest (${Math.round(score * 100)}% compatibility).`;
      if (i < 5 && row.title) {
        rationale = `Project ${row.title} seeks co-founder with skills in ${seekingTagsStr} (${Math.round(score * 100)}% match).`;
      }

      results.push({
        idea: {
          id: row.id,
          user_id: row.user_id,
          title: row.title,
          description: row.description,
          seeking_tags: Array.isArray(row.seeking_tags) ? row.seeking_tags : [],
          visibility: row.visibility,
          readiness_score: row.readiness_score,
        },
        similarity_score: score,
        match_rationale: rationale,
      });
    }

    await redisClient.set(cacheKey, JSON.stringify(results), 86400);
    return results;
  }

  /**
   * Generates or updates User offering embedding vector
   */
  async updateUserOfferingEmbedding(userId: string, offeringTags: string[], bio?: string): Promise<void> {
    const textToEmbed = [...offeringTags, bio ?? ''].filter(Boolean).join(' ');
    const vector = await this.embeddingClient.generateEmbedding(textToEmbed);
    await this.userRepo.updateEmbeddings(userId, vector, undefined);
  }
}
