import { randomUUID } from 'node:crypto';

import type {
  CreateIdeaInput,
  Idea,
  IdeaVisibility,
  IIdeaRepository,
  ScanResultInput,
  UpdateIdeaInput,
} from './idea.repository.interface';

export class FakeIdeaRepository implements IIdeaRepository {
  private readonly store = new Map<string, Idea>();

  async create(input: CreateIdeaInput): Promise<Idea> {
    const now = new Date();
    const idea: Idea = {
      id: randomUUID(),
      user_id: input.user_id,
      title: input.title,
      description: input.description ?? null,
      manual_description: input.manual_description ?? null,
      visibility: input.visibility ?? 'private_ai_recommend',
      ai_summary: null,
      stack_detected: [],
      readiness_score: null,
      readiness_rationale: null,
      last_scanned_at: null,
      created_at: now,
      updated_at: now,
    };
    this.store.set(idea.id, idea);
    return structuredClone(idea);
  }

  async findById(id: string): Promise<Idea | null> {
    const idea = this.store.get(id);
    return idea ? structuredClone(idea) : null;
  }

  async findByUserId(userId: string): Promise<Idea[]> {
    return [...this.store.values()]
      .filter((item) => item.user_id === userId)
      .map((item) => structuredClone(item));
  }

  async update(id: string, input: UpdateIdeaInput): Promise<Idea | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: Idea = { ...existing, ...input, updated_at: new Date() };
    this.store.set(id, updated);
    return structuredClone(updated);
  }

  async updateScanResult(id: string, scan: ScanResultInput): Promise<Idea | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const now = new Date();
    const updated: Idea = {
      ...existing,
      ai_summary: scan.ai_summary,
      stack_detected: scan.stack_detected,
      readiness_score: scan.readiness_score,
      readiness_rationale: scan.readiness_rationale,
      last_scanned_at: now,
      updated_at: now,
    };
    this.store.set(id, updated);
    return structuredClone(updated);
  }

  async updateManualDescription(id: string, description: string): Promise<Idea | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: Idea = {
      ...existing,
      manual_description: description,
      updated_at: new Date(),
    };
    this.store.set(id, updated);
    return structuredClone(updated);
  }

  async updateVisibility(id: string, visibility: IdeaVisibility): Promise<Idea | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: Idea = {
      ...existing,
      visibility,
      updated_at: new Date(),
    };
    this.store.set(id, updated);
    return structuredClone(updated);
  }

  async updateSeekingEmbedding(id: string, seekingTags: string[], seekingEmbedding: number[]): Promise<Idea | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: Idea = {
      ...existing,
      seeking_tags: seekingTags,
      seeking_embedding: seekingEmbedding,
      updated_at: new Date(),
    };
    this.store.set(id, updated);
    return structuredClone(updated);
  }

  async findPublicIdeas(limit: number = 20, offset: number = 0): Promise<Idea[]> {
    return [...this.store.values()]
      .filter((item) => item.visibility === 'public')
      .slice(offset, offset + limit)
      .map((item) => structuredClone(item));
  }

  async searchPublicIdeas(
    query?: string,
    tags?: string[],
    limit: number = 20,
    offset: number = 0
  ): Promise<Idea[]> {
    let items = [...this.store.values()].filter((item) => item.visibility === 'public');

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.description && i.description.toLowerCase().includes(q)) ||
          (i.ai_summary && i.ai_summary.toLowerCase().includes(q))
      );
    }

    if (tags && tags.length > 0) {
      items = items.filter(
        (i) =>
          (i.stack_detected && i.stack_detected.some((t) => tags.includes(t))) ||
          (i.seeking_tags && i.seeking_tags.some((t) => tags.includes(t)))
      );
    }

    return items.slice(offset, offset + limit).map((item) => structuredClone(item));
  }

  clear(): void {
    this.store.clear();
  }
}
