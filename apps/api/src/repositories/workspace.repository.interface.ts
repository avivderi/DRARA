export interface Workspace {
  id: string;
  match_id: string;
  project_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface IdeaBoardEntry {
  id: string;
  workspace_id: string;
  section: string; // 'vision' | 'problem' | 'audience' | 'solution' | 'business_model'
  content: string;
  updated_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface RoadmapMilestone {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  due_date: Date | null;
  status: 'not_started' | 'in_progress' | 'done';
  assigned_to: string | null;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DecisionEntry {
  id: string;
  workspace_id: string;
  title: string;
  rationale: string;
  decided_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface EquityTopic {
  id: string;
  workspace_id: string;
  topic: string; // 'equity_split' | 'vesting_schedule' | 'departure_terms' | 'ip_ownership'
  discussed: boolean;
  discussed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface IWorkspaceRepository {
  findById(id: string): Promise<Workspace | null>;
  findByMatchId(matchId: string): Promise<Workspace | null>;
  create(data: { match_id: string; project_name?: string }): Promise<Workspace>;
}

export interface IIdeaBoardRepository {
  getEntries(workspaceId: string): Promise<IdeaBoardEntry[]>;
  upsertEntry(workspaceId: string, section: string, content: string, updatedBy?: string): Promise<IdeaBoardEntry>;
}

export interface IRoadmapRepository {
  getMilestones(workspaceId: string): Promise<RoadmapMilestone[]>;
  findById(id: string): Promise<RoadmapMilestone | null>;
  createMilestone(data: {
    workspace_id: string;
    title: string;
    description?: string;
    due_date?: Date | string;
    status?: 'not_started' | 'in_progress' | 'done';
    assigned_to?: string;
    created_by?: string;
  }): Promise<RoadmapMilestone>;
  updateMilestone(
    id: string,
    data: Partial<{
      title: string;
      description: string | null;
      due_date: Date | string | null;
      status: 'not_started' | 'in_progress' | 'done';
      assigned_to: string | null;
    }>,
  ): Promise<RoadmapMilestone | null>;
}

export interface IDecisionRepository {
  getDecisions(workspaceId: string): Promise<DecisionEntry[]>;
  createDecision(data: {
    workspace_id: string;
    title: string;
    rationale: string;
    decided_by?: string;
  }): Promise<DecisionEntry>;
}

export interface IEquityRepository {
  getTopics(workspaceId: string): Promise<EquityTopic[]>;
  upsertTopic(workspaceId: string, topic: string, discussed: boolean): Promise<EquityTopic>;
}
