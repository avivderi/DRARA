import { AppError } from '../lib/errors';
import type { IIdeaRepository } from '../repositories/idea.repository.interface';
import type { IUserRepository, User } from '../repositories/user.repository.interface';

import { AIServiceClient } from './ai-service.client';

export interface MatchResult {
  candidate: User;
  similarityScore: number;
  aiRationale: string;
}

export class MatchingService {
  private readonly rationaleCache = new Map<string, string>();

  constructor(
    private readonly ideaRepo: IIdeaRepository,
    private readonly userRepo: IUserRepository,
    private readonly aiClient: AIServiceClient,
  ) {}

  async getMatchesForIdea(
    requestingUserId: string,
    ideaId: string,
    limit: number = 10,
  ): Promise<MatchResult[]> {
    const idea = await this.ideaRepo.findById(ideaId);
    if (!idea) {
      throw AppError.notFound('Idea not found');
    }

    // Enforcement of Visibility Rules (DoD Item 4 & Module 1 Schema)
    // If idea is private_ai_recommend or invite_only, matches are ONLY returned to the owner
    if (idea.visibility === 'private_ai_recommend' || idea.visibility === 'invite_only') {
      if (idea.user_id !== requestingUserId) {
        return [];
      }
    }

    // Ensure seeking_embedding vector is generated
    let seekingEmbedding = idea.seeking_embedding;
    if (!seekingEmbedding || seekingEmbedding.length === 0) {
      const tags = idea.seeking_tags ?? [];
      const textToEmbed = `${idea.title} | ${idea.description ?? ''} | Tags: ${tags.join(', ')}`;
      seekingEmbedding = await this.aiClient.generateEmbedding({ text: textToEmbed, tags });
      await this.ideaRepo.updateSeekingEmbedding(idea.id, tags, seekingEmbedding);
    }

    // Perform vector similarity query
    const candidates = await this.userRepo.findMatchingUsersForOfferingVector(
      seekingEmbedding,
      idea.user_id,
      limit,
    );

    // Build match rationale for Top 5 candidates with caching (DoD Item 5)
    const results: MatchResult[] = [];
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i]!;
      let rationale = 'Match based on overlapping skills and vector similarity.';

      if (i < 5) {
        const cacheKey = `${idea.id}:${candidate.user.id}`;
        if (this.rationaleCache.has(cacheKey)) {
          rationale = this.rationaleCache.get(cacheKey)!;
        } else {
          rationale = this.generateRationaleText(idea.title, idea.seeking_tags ?? [], candidate.user);
          this.rationaleCache.set(cacheKey, rationale);
        }
      }

      results.push({
        candidate: candidate.user,
        similarityScore: candidate.similarityScore,
        aiRationale: rationale,
      });
    }

    return results;
  }

  private generateRationaleText(ideaTitle: string, seekingTags: string[], candidate: User): string {
    const candidateSkills = candidate.offering_tags ?? candidate.skills ?? [];
    const matched = seekingTags.filter((t) => candidateSkills.includes(t));
    if (matched.length > 0) {
      return `Strong technical match: Candidate offers ${matched.join(', ')} directly aligned with ${ideaTitle}.`;
    }
    return `Candidate profile and background match the core domain requirements of ${ideaTitle}.`;
  }
}
