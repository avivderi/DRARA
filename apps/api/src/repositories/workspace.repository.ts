import type { Knex } from 'knex';

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

export class KnexWorkspaceRepository implements IWorkspaceRepository {
  constructor(private readonly knex: Knex) {}

  async findById(id: string): Promise<Workspace | null> {
    const row = await this.knex('workspaces').where({ id }).first();
    return row ? (row as Workspace) : null;
  }

  async findByMatchId(matchId: string): Promise<Workspace | null> {
    const row = await this.knex('workspaces').where({ match_id: matchId }).first();
    return row ? (row as Workspace) : null;
  }

  async create(data: { match_id: string; project_name?: string }): Promise<Workspace> {
    const [row] = await this.knex('workspaces')
      .insert({
        match_id: data.match_id,
        project_name: data.project_name || 'Co-Founding Workspace',
      })
      .returning('*');
    return row as Workspace;
  }
}

export class KnexIdeaBoardRepository implements IIdeaBoardRepository {
  constructor(private readonly knex: Knex) {}

  async getEntries(workspaceId: string): Promise<IdeaBoardEntry[]> {
    const rows = await this.knex('idea_board_entries')
      .where({ workspace_id: workspaceId })
      .orderBy('created_at', 'asc');
    return rows as IdeaBoardEntry[];
  }

  async upsertEntry(
    workspaceId: string,
    section: string,
    content: string,
    updatedBy?: string,
  ): Promise<IdeaBoardEntry> {
    const existing = await this.knex('idea_board_entries')
      .where({ workspace_id: workspaceId, section })
      .first();

    if (existing) {
      const [updated] = await this.knex('idea_board_entries')
        .where({ id: existing.id })
        .update({
          content,
          updated_by: updatedBy || null,
          updated_at: new Date(),
        })
        .returning('*');
      return updated as IdeaBoardEntry;
    }

    const [created] = await this.knex('idea_board_entries')
      .insert({
        workspace_id: workspaceId,
        section,
        content,
        updated_by: updatedBy || null,
      })
      .returning('*');
    return created as IdeaBoardEntry;
  }
}

export class KnexRoadmapRepository implements IRoadmapRepository {
  constructor(private readonly knex: Knex) {}

  async getMilestones(workspaceId: string): Promise<RoadmapMilestone[]> {
    const rows = await this.knex('roadmap_milestones')
      .where({ workspace_id: workspaceId })
      .orderBy('created_at', 'asc');
    return rows as RoadmapMilestone[];
  }

  async findById(id: string): Promise<RoadmapMilestone | null> {
    const row = await this.knex('roadmap_milestones').where({ id }).first();
    return row ? (row as RoadmapMilestone) : null;
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
    const [row] = await this.knex('roadmap_milestones')
      .insert({
        workspace_id: data.workspace_id,
        title: data.title,
        description: data.description || null,
        due_date: data.due_date ? new Date(data.due_date) : null,
        status: data.status || 'not_started',
        assigned_to: data.assigned_to || null,
        created_by: data.created_by || null,
      })
      .returning('*');
    return row as RoadmapMilestone;
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
    const updateData: Record<string, unknown> = { updated_at: new Date() };
    if (data.title !== undefined) updateData['title'] = data.title;
    if (data.description !== undefined) updateData['description'] = data.description;
    if (data.due_date !== undefined) updateData['due_date'] = data.due_date ? new Date(data.due_date) : null;
    if (data.status !== undefined) updateData['status'] = data.status;
    if (data.assigned_to !== undefined) updateData['assigned_to'] = data.assigned_to;

    const [row] = await this.knex('roadmap_milestones')
      .where({ id })
      .update(updateData)
      .returning('*');

    return row ? (row as RoadmapMilestone) : null;
  }
}

export class KnexDecisionRepository implements IDecisionRepository {
  constructor(private readonly knex: Knex) {}

  async getDecisions(workspaceId: string): Promise<DecisionEntry[]> {
    const rows = await this.knex('decisions')
      .where({ workspace_id: workspaceId })
      .orderBy('created_at', 'desc');
    return rows as DecisionEntry[];
  }

  async createDecision(data: {
    workspace_id: string;
    title: string;
    rationale: string;
    decided_by?: string;
  }): Promise<DecisionEntry> {
    const [row] = await this.knex('decisions')
      .insert({
        workspace_id: data.workspace_id,
        title: data.title,
        rationale: data.rationale,
        decided_by: data.decided_by || null,
      })
      .returning('*');
    return row as DecisionEntry;
  }
}

export class KnexEquityRepository implements IEquityRepository {
  constructor(private readonly knex: Knex) {}

  async getTopics(workspaceId: string): Promise<EquityTopic[]> {
    const rows = await this.knex('equity_discussion_topics')
      .where({ workspace_id: workspaceId })
      .orderBy('created_at', 'asc');
    return rows as EquityTopic[];
  }

  async upsertTopic(workspaceId: string, topic: string, discussed: boolean): Promise<EquityTopic> {
    const existing = await this.knex('equity_discussion_topics')
      .where({ workspace_id: workspaceId, topic })
      .first();

    const discussedAt = discussed ? new Date() : null;

    if (existing) {
      const [updated] = await this.knex('equity_discussion_topics')
        .where({ id: existing.id })
        .update({
          discussed,
          discussed_at: discussedAt,
          updated_at: new Date(),
        })
        .returning('*');
      return updated as EquityTopic;
    }

    const [created] = await this.knex('equity_discussion_topics')
      .insert({
        workspace_id: workspaceId,
        topic,
        discussed,
        discussed_at: discussedAt,
      })
      .returning('*');
    return created as EquityTopic;
  }
}
