import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { redisClient } from '../lib/redis';
import type { ConnectedRepo, IConnectedRepoRepository } from '../repositories/connected-repo.repository.interface';
import type { Idea, IdeaVisibility, IIdeaRepository } from '../repositories/idea.repository.interface';

import type { AIServiceClient } from './ai-service.client';

const MAX_SCANS_PER_DAY = Number(process.env['MAX_SCANS_PER_DAY'] ?? 5);

export class IdeasService {
  constructor(
    private readonly ideaRepo: IIdeaRepository,
    private readonly connectedRepoRepo: IConnectedRepoRepository,
    private readonly aiClient: AIServiceClient,
  ) {}

  async createIdea(
    userId: string,
    title: string,
    description?: string,
    manualDescription?: string,
    visibility?: IdeaVisibility,
  ): Promise<Idea> {
    if (!title?.trim()) {
      throw AppError.badRequest('Title is required');
    }

    return this.ideaRepo.create({
      user_id: userId,
      title: title.trim(),
      description: description?.trim(),
      manual_description: manualDescription?.trim(),
      visibility,
    });
  }

  async getIdeaById(id: string): Promise<Idea> {
    const idea = await this.ideaRepo.findById(id);
    if (!idea) throw AppError.notFound('Idea not found');
    return idea;
  }

  async getUserIdeas(userId: string): Promise<Idea[]> {
    return this.ideaRepo.findByUserId(userId);
  }

  async connectRepo(
    userId: string,
    ideaId: string,
    githubRepoFullName: string,
    installationId: string,
  ): Promise<ConnectedRepo> {
    const idea = await this.ideaRepo.findById(ideaId);
    if (!idea) throw AppError.notFound('Idea not found');
    if (idea.user_id !== userId) throw AppError.forbidden('Forbidden');

    let repo = await this.connectedRepoRepo.findByRepoFullName(userId, githubRepoFullName);
    if (!repo) {
      repo = await this.connectedRepoRepo.create({
        user_id: userId,
        idea_id: ideaId,
        github_repo_full_name: githubRepoFullName,
        installation_id: installationId,
      });
    } else {
      repo = await this.connectedRepoRepo.linkToIdea(repo.id, ideaId);
    }
    return repo;
  }

  async scanIdea(userId: string, ideaId: string, force = false): Promise<Idea> {
    const idea = await this.ideaRepo.findById(ideaId);
    if (!idea) throw AppError.notFound('Idea not found');
    if (idea.user_id !== userId) throw AppError.forbidden('Forbidden');

    // 1. Feature flag check
    const isAiScanEnabled = process.env['GITHUB_AI_SCAN_ENABLED'] !== 'false';
    if (!isAiScanEnabled) {
      throw AppError.badRequest(
        'GITHUB_AI_SCAN_DISABLED: AI scanning is disabled. Please provide a manual description.',
        'FEATURE_DISABLED',
      );
    }

    // 2. Caching logic — if scanned within 7 days and force is false, return cached
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    if (
      !force &&
      idea.last_scanned_at &&
      new Date().getTime() - new Date(idea.last_scanned_at).getTime() < SEVEN_DAYS_MS
    ) {
      logger.info({ ideaId }, 'Returning cached scan result');
      return idea;
    }

    // 3. Rate limiting via Redis (max 5 scans per day per user)
    const rateLimitKey = `rate:scan:${userId}:${new Date().toISOString().slice(0, 10)}`;
    const currentCountStr = await redisClient.get(rateLimitKey);
    const currentCount = currentCountStr ? Number(currentCountStr) : 0;

    if (currentCount >= MAX_SCANS_PER_DAY) {
      throw AppError.badRequest(
        `Rate limit exceeded: Maximum ${MAX_SCANS_PER_DAY} scans per day allowed.`,
        'RATE_LIMIT_EXCEEDED',
      );
    }

    // Find connected repository
    const connectedRepo = await this.connectedRepoRepo.findByIdeaId(ideaId);
    const repoFullName = connectedRepo?.github_repo_full_name ?? 'avivderi/DRARA';
    const installationId = connectedRepo?.installation_id ?? 'inst_demo';

    // Call AI microservice
    const scanResult = await this.aiClient.scanRepository({
      github_repo_full_name: repoFullName,
      installation_id: installationId,
      force,
    });

    // Update Redis rate limit counter (TTL 24 hours)
    await redisClient.set(rateLimitKey, String(currentCount + 1), 86400);

    // Save scan result in DB
    const updated = await this.ideaRepo.updateScanResult(ideaId, {
      ai_summary: scanResult.ai_summary,
      stack_detected: scanResult.stack_detected,
      readiness_score: scanResult.readiness_score,
      readiness_rationale: scanResult.readiness_rationale,
    });

    if (connectedRepo) {
      await this.connectedRepoRepo.updateLastScanned(connectedRepo.id);
    }

    return updated!;
  }

  async setManualDescription(
    userId: string,
    ideaId: string,
    manualDescription: string,
  ): Promise<Idea> {
    const idea = await this.ideaRepo.findById(ideaId);
    if (!idea) throw AppError.notFound('Idea not found');
    if (idea.user_id !== userId) throw AppError.forbidden('Forbidden');

    if (!manualDescription?.trim()) {
      throw AppError.badRequest('Manual description cannot be empty');
    }

    const updated = await this.ideaRepo.updateManualDescription(
      ideaId,
      manualDescription.trim(),
    );
    return updated!;
  }

  async setVisibility(
    userId: string,
    ideaId: string,
    visibility: IdeaVisibility,
  ): Promise<Idea> {
    const idea = await this.ideaRepo.findById(ideaId);
    if (!idea) throw AppError.notFound('Idea not found');
    if (idea.user_id !== userId) throw AppError.forbidden('Forbidden');

    // Rule: Public visibility REQUIRES either ai_summary OR manual_description
    if (visibility === 'public') {
      const hasAiSummary = Boolean(idea.ai_summary?.trim());
      const hasManualDesc = Boolean(idea.manual_description?.trim());
      if (!hasAiSummary && !hasManualDesc) {
        throw AppError.badRequest(
          'Idea must have an AI summary or manual description before making it public.',
          'DESCRIPTION_REQUIRED_FOR_PUBLIC',
        );
      }
    }

    const updated = await this.ideaRepo.updateVisibility(ideaId, visibility);
    return updated!;
  }
}
