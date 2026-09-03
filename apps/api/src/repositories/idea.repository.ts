import type { Knex } from 'knex';

import type {
  CreateIdeaInput,
  Idea,
  IdeaVisibility,
  IIdeaRepository,
  ScanResultInput,
  UpdateIdeaInput,
} from './idea.repository.interface';

export class KnexIdeaRepository implements IIdeaRepository {
  constructor(private readonly db: Knex) {}

  async create(input: CreateIdeaInput): Promise<Idea> {
    const [idea] = await this.db<Idea>('ideas')
      .insert({
        user_id: input.user_id,
        title: input.title,
        description: input.description ?? null,
        manual_description: input.manual_description ?? null,
        visibility: input.visibility ?? 'private_ai_recommend',
        stack_detected: this.db.raw('ARRAY[]::text[]'),
      })
      .returning('*');

    if (!idea) throw new Error('Failed to create idea');
    return idea;
  }

  async findById(id: string): Promise<Idea | null> {
    const idea = await this.db<Idea>('ideas').where({ id }).first();
    return idea ?? null;
  }

  async findByUserId(userId: string): Promise<Idea[]> {
    return this.db<Idea>('ideas').where({ user_id: userId }).orderBy('created_at', 'desc');
  }

  async update(id: string, input: UpdateIdeaInput): Promise<Idea | null> {
    const [updated] = await this.db<Idea>('ideas')
      .where({ id })
      .update({ ...input, updated_at: this.db.fn.now() })
      .returning('*');
    return updated ?? null;
  }

  async updateScanResult(id: string, scan: ScanResultInput): Promise<Idea | null> {
    const [updated] = await this.db<Idea>('ideas')
      .where({ id })
      .update({
        ai_summary: scan.ai_summary,
        stack_detected: scan.stack_detected,
        readiness_score: scan.readiness_score,
        readiness_rationale: scan.readiness_rationale,
        last_scanned_at: this.db.fn.now(),
        updated_at: this.db.fn.now(),
      })
      .returning('*');
    return updated ?? null;
  }

  async updateManualDescription(id: string, description: string): Promise<Idea | null> {
    const [updated] = await this.db<Idea>('ideas')
      .where({ id })
      .update({
        manual_description: description,
        updated_at: this.db.fn.now(),
      })
      .returning('*');
    return updated ?? null;
  }

  async updateVisibility(id: string, visibility: IdeaVisibility): Promise<Idea | null> {
    const [updated] = await this.db<Idea>('ideas')
      .where({ id })
      .update({
        visibility,
        updated_at: this.db.fn.now(),
      })
      .returning('*');
    return updated ?? null;
  }
}
