import crypto from 'crypto';

import type {
  DecisionEntry,
  EquityTopic,
  IDecisionRepository,
  IEquityRepository,
  IIdeaBoardRepository,
  IRoadmapRepository,
  IWorkspaceRepository,
  IdeaBoardEntry,
  RoadmapMilestone,
  Workspace,
} from './workspace.repository.interface';

export class FakeWorkspaceRepository implements IWorkspaceRepository {
  private workspaces: Workspace[] = [];

  async findById(id: string): Promise<Workspace | null> {
    const ws = this.workspaces.find((w) => w.id === id);
    return ws ? structuredClone(ws) : null;
  }

  async findByMatchId(matchId: string): Promise<Workspace | null> {
    const ws = this.workspaces.find((w) => w.match_id === matchId);
    return ws ? structuredClone(ws) : null;
  }

  async create(data: { match_id: string; project_name?: string }): Promise<Workspace> {
    const now = new Date();
    const ws: Workspace = {
      id: `ws_${crypto.randomUUID()}`,
      match_id: data.match_id,
      project_name: data.project_name || 'Co-Founding Workspace',
      created_at: now,
      updated_at: now,
    };
    this.workspaces.push(ws);
    return structuredClone(ws);
  }
}

export class FakeIdeaBoardRepository implements IIdeaBoardRepository {
  private entries: IdeaBoardEntry[] = [];

  async getEntries(workspaceId: string): Promise<IdeaBoardEntry[]> {
    return structuredClone(this.entries.filter((e) => e.workspace_id === workspaceId));
  }

  async upsertEntry(
    workspaceId: string,
    section: string,
    content: string,
    updatedBy?: string,
  ): Promise<IdeaBoardEntry> {
    const existingIndex = this.entries.findIndex(
      (e) => e.workspace_id === workspaceId && e.section === section,
    );

    const now = new Date();
    if (existingIndex >= 0) {
      const updated: IdeaBoardEntry = {
        ...this.entries[existingIndex]!,
        content,
        updated_by: updatedBy || null,
        updated_at: now,
      };
      this.entries[existingIndex] = updated;
      return structuredClone(updated);
    }

    const created: IdeaBoardEntry = {
      id: `ibe_${crypto.randomUUID()}`,
      workspace_id: workspaceId,
      section,
      content,
      updated_by: updatedBy || null,
      created_at: now,
      updated_at: now,
    };
    this.entries.push(created);
    return structuredClone(created);
  }
}

export class FakeRoadmapRepository implements IRoadmapRepository {
  private milestones: RoadmapMilestone[] = [];

  async getMilestones(workspaceId: string): Promise<RoadmapMilestone[]> {
    return structuredClone(this.milestones.filter((m) => m.workspace_id === workspaceId));
  }

  async findById(id: string): Promise<RoadmapMilestone | null> {
    const m = this.milestones.find((item) => item.id === id);
    return m ? structuredClone(m) : null;
  }

  async createMilestone(data: {
    workspace_id: string;
    title: string;
    description?: string;
    due_date?: Date | string;
    status?: 'not_started' | 'in_progress' | 'done';
    assigned_to?: string;
    created_by?: string;
  }): Promise<RoadmapMilestone> {
    const now = new Date();
    const milestone: RoadmapMilestone = {
      id: `ms_${crypto.randomUUID()}`,
      workspace_id: data.workspace_id,
      title: data.title,
      description: data.description || null,
      due_date: data.due_date ? new Date(data.due_date) : null,
      status: data.status || 'not_started',
      assigned_to: data.assigned_to || null,
      created_by: data.created_by || null,
      created_at: now,
      updated_at: now,
    };
    this.milestones.push(milestone);
    return structuredClone(milestone);
  }

  async updateMilestone(
    id: string,
    data: Partial<{
      title: string;
      description: string | null;
      due_date: Date | string | null;
      status: 'not_started' | 'in_progress' | 'done';
      assigned_to: string | null;
    }>,
  ): Promise<RoadmapMilestone | null> {
    const idx = this.milestones.findIndex((m) => m.id === id);
    if (idx < 0) return null;

    const current = this.milestones[idx]!;
    const updated: RoadmapMilestone = {
      ...current,
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.due_date !== undefined && { due_date: data.due_date ? new Date(data.due_date) : null }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.assigned_to !== undefined && { assigned_to: data.assigned_to }),
      updated_at: new Date(),
    };
    this.milestones[idx] = updated;
    return structuredClone(updated);
  }
}

export class FakeDecisionRepository implements IDecisionRepository {
  private decisions: DecisionEntry[] = [];

  async getDecisions(workspaceId: string): Promise<DecisionEntry[]> {
    return structuredClone(this.decisions.filter((d) => d.workspace_id === workspaceId));
  }

  async createDecision(data: {
    workspace_id: string;
    title: string;
    rationale: string;
    decided_by?: string;
  }): Promise<DecisionEntry> {
    const now = new Date();
    const entry: DecisionEntry = {
      id: `dec_${crypto.randomUUID()}`,
      workspace_id: data.workspace_id,
      title: data.title,
      rationale: data.rationale,
      decided_by: data.decided_by || null,
      created_at: now,
      updated_at: now,
    };
    this.decisions.push(entry);
    return structuredClone(entry);
  }
}

export class FakeEquityRepository implements IEquityRepository {
  private topics: EquityTopic[] = [];

  async getTopics(workspaceId: string): Promise<EquityTopic[]> {
    return structuredClone(this.topics.filter((t) => t.workspace_id === workspaceId));
  }

  async upsertTopic(workspaceId: string, topic: string, discussed: boolean): Promise<EquityTopic> {
    const idx = this.topics.findIndex((t) => t.workspace_id === workspaceId && t.topic === topic);
    const now = new Date();
    const discussedAt = discussed ? now : null;

    if (idx >= 0) {
      const updated: EquityTopic = {
        ...this.topics[idx]!,
        discussed,
        discussed_at: discussedAt,
        updated_at: now,
      };
      this.topics[idx] = updated;
      return structuredClone(updated);
    }

    const created: EquityTopic = {
      id: `eq_${crypto.randomUUID()}`,
      workspace_id: workspaceId,
      topic,
      discussed,
      discussed_at: discussedAt,
      created_at: now,
      updated_at: now,
    };
    this.topics.push(created);
    return structuredClone(created);
  }
}
