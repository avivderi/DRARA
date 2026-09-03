export type IdeaVisibility = 'public' | 'private_ai_recommend' | 'invite_only';

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  manual_description: string | null;
  visibility: IdeaVisibility;
  seeking_tags?: string[];
  ai_summary: string | null;
  stack_detected: string[];
  readiness_score: number | null;
  readiness_rationale: string | null;
  last_scanned_at: Date | null;
  seeking_embedding?: number[];
  created_at: Date;
  updated_at: Date;
}

export type CreateIdeaInput = Pick<Idea, 'user_id' | 'title'> & {
  description?: string;
  manual_description?: string;
  seeking_tags?: string[];
  visibility?: IdeaVisibility;
};

export type UpdateIdeaInput = Partial<
  Pick<Idea, 'title' | 'description' | 'manual_description' | 'seeking_tags' | 'visibility'>
>;

export interface ScanResultInput {
  ai_summary: string;
  stack_detected: string[];
  readiness_score: number;
  readiness_rationale: string;
}

export interface IIdeaRepository {
  create(input: CreateIdeaInput): Promise<Idea>;
  findById(id: string): Promise<Idea | null>;
  findByUserId(userId: string): Promise<Idea[]>;
  update(id: string, input: UpdateIdeaInput): Promise<Idea | null>;
  updateScanResult(id: string, scan: ScanResultInput): Promise<Idea | null>;
  updateManualDescription(id: string, description: string): Promise<Idea | null>;
  updateVisibility(id: string, visibility: IdeaVisibility): Promise<Idea | null>;
  updateSeekingEmbedding(id: string, seekingVector: number[]): Promise<void>;
}
