export type IdeaVisibility = 'public' | 'private_ai_recommend' | 'invite_only';

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  manual_description: string | null;
  visibility: IdeaVisibility;
  ai_summary: string | null;
  stack_detected: string[];
  readiness_score: number | null;
  readiness_rationale: string | null;
  last_scanned_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export type CreateIdeaInput = Pick<Idea, 'user_id' | 'title'> & {
  description?: string;
  manual_description?: string;
  visibility?: IdeaVisibility;
};

export type UpdateIdeaInput = Partial<
  Pick<Idea, 'title' | 'description' | 'manual_description' | 'visibility'>
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
}
