import { AppError } from '../lib/errors';
import type { IMatchRepository } from '../repositories/match.repository.interface';
import type { IUserRepository } from '../repositories/user.repository.interface';
import type {
  IDecisionRepository,
  IEquityRepository,
  IIdeaBoardRepository,
  IRoadmapRepository,
  IWorkspaceRepository,
  RoadmapMilestone,
} from '../repositories/workspace.repository.interface';
import type { AIServiceClient } from './ai-service.client';

export const DEFAULT_EQUITY_TOPICS = [
  { topic: 'equity_split', label: 'Equity split & ownership percentages' },
  { topic: 'vesting_schedule', label: 'Vesting schedule & cliff terms' },
  { topic: 'departure_terms', label: 'Departure terms & bad leaver rules' },
  { topic: 'ip_ownership', label: 'Intellectual property (IP) assignment' },
];

export const LEGAL_DISCLAIMER =
  'This framework is for discussion tracking purposes only and does not constitute legal, tax, or financial advice or a binding legal agreement.';

export class WorkspaceService {
  constructor(
    private readonly workspaceRepo: IWorkspaceRepository,
    private readonly ideaBoardRepo: IIdeaBoardRepository,
    private readonly roadmapRepo: IRoadmapRepository,
    private readonly decisionRepo: IDecisionRepository,
    private readonly equityRepo: IEquityRepository,
    private readonly matchRepo: IMatchRepository,
    private readonly userRepo: IUserRepository,
    private readonly aiClient?: AIServiceClient,
  ) {}

  /**
   * Verifies that workspace exists and the requesting user is a match participant.
   */
  async verifyWorkspaceAccess(workspaceId: string, userId: string) {
    const workspace = await this.workspaceRepo.findById(workspaceId);
    if (!workspace) {
      throw AppError.notFound('Workspace not found');
    }

    const match = await this.matchRepo.findById(workspace.match_id);
    if (!match) {
      throw AppError.notFound('Match associated with workspace not found');
    }

    if (match.user1_id !== userId && match.user2_id !== userId) {
      throw AppError.forbidden('Access denied: You are not a member of this workspace');
    }

    return { workspace, match };
  }

  /**
   * Retrieves aggregated workspace overview.
   */
  async getWorkspaceOverview(workspaceId: string, userId: string) {
    const { workspace, match } = await this.verifyWorkspaceAccess(workspaceId, userId);

    const [user1, user2] = await Promise.all([
      this.userRepo.findById(match.user1_id),
      this.userRepo.findById(match.user2_id),
    ]);

    const teamMembers = [user1, user2]
      .filter((u): u is NonNullable<typeof u> => u !== null)
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatar_url: u.avatar_url,
        offering_tags: u.offering_tags || [],
      }));

    const milestones = await this.roadmapRepo.getMilestones(workspaceId);
    const completedMilestones = milestones.filter((m) => m.status === 'done').length;
    const inProgressMilestones = milestones.filter((m) => m.status === 'in_progress').length;

    const decisions = await this.decisionRepo.getDecisions(workspaceId);
    const equityTopics = await this.equityRepo.getTopics(workspaceId);
    const discussedTopicsCount = equityTopics.filter((t) => t.discussed).length;

    return {
      workspace,
      team_members: teamMembers,
      roadmap_summary: {
        total_milestones: milestones.length,
        completed_milestones: completedMilestones,
        in_progress_milestones: inProgressMilestones,
      },
      decisions_summary: {
        total_decisions: decisions.length,
      },
      equity_summary: {
        topics_discussed: discussedTopicsCount,
        total_topics: DEFAULT_EQUITY_TOPICS.length,
      },
    };
  }

  /**
   * Fetches idea board text entries.
   */
  async getIdeaBoard(workspaceId: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);
    const existingEntries = await this.ideaBoardRepo.getEntries(workspaceId);

    const sections = ['vision', 'problem', 'audience', 'solution', 'business_model'];
    const entriesMap = new Map(existingEntries.map((e) => [e.section, e]));

    return sections.map((sec) => {
      const entry = entriesMap.get(sec);
      return {
        section: sec,
        content: entry?.content || '',
        updated_by: entry?.updated_by || null,
        updated_at: entry?.updated_at || null,
      };
    });
  }

  /**
   * Updates an idea board section text entry.
   */
  async updateIdeaBoardSection(
    workspaceId: string,
    section: string,
    content: string,
    userId: string,
  ) {
    await this.verifyWorkspaceAccess(workspaceId, userId);
    const allowedSections = ['vision', 'problem', 'audience', 'solution', 'business_model'];
    if (!allowedSections.includes(section)) {
      throw AppError.badRequest(`Invalid section '${section}'. Allowed: ${allowedSections.join(', ')}`);
    }

    return this.ideaBoardRepo.upsertEntry(workspaceId, section, content, userId);
  }

  /**
   * Fetches roadmap milestones.
   */
  async getRoadmap(workspaceId: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);
    return this.roadmapRepo.getMilestones(workspaceId);
  }

  /**
   * Creates a roadmap milestone.
   */
  async createMilestone(
    workspaceId: string,
    userId: string,
    data: {
      title: string;
      description?: string;
      due_date?: Date | string;
      status?: 'not_started' | 'in_progress' | 'done';
      assigned_to?: string;
    },
  ) {
    await this.verifyWorkspaceAccess(workspaceId, userId);
    if (!data.title || data.title.trim() === '') {
      throw AppError.badRequest('Milestone title is required');
    }

    return this.roadmapRepo.createMilestone({
      workspace_id: workspaceId,
      title: data.title.trim(),
      description: data.description,
      due_date: data.due_date,
      status: data.status,
      assigned_to: data.assigned_to,
      created_by: userId,
    });
  }

  /**
   * Updates a roadmap milestone.
   */
  async updateMilestone(
    workspaceId: string,
    milestoneId: string,
    userId: string,
    data: Partial<{
      title: string;
      description: string | null;
      due_date: Date | string | null;
      status: 'not_started' | 'in_progress' | 'done';
      assigned_to: string | null;
    }>,
  ) {
    await this.verifyWorkspaceAccess(workspaceId, userId);
    const milestone = await this.roadmapRepo.findById(milestoneId);
    if (!milestone || milestone.workspace_id !== workspaceId) {
      throw AppError.notFound('Roadmap milestone not found');
    }

    const updated = await this.roadmapRepo.updateMilestone(milestoneId, data);
    if (!updated) {
      throw AppError.notFound('Failed to update milestone');
    }

    return updated;
  }

  /**
   * Generates AI-suggested milestones.
   */
  async suggestAIMilestones(workspaceId: string, userId: string): Promise<RoadmapMilestone[]> {
    const { workspace } = await this.verifyWorkspaceAccess(workspaceId, userId);

    if (!this.aiClient) {
      throw AppError.internal('AI client is not configured');
    }

    const suggestions = await this.aiClient.suggestMilestones({
      project_name: workspace.project_name,
    });

    const createdMilestones: RoadmapMilestone[] = [];
    for (const sugg of suggestions) {
      const ms = await this.roadmapRepo.createMilestone({
        workspace_id: workspaceId,
        title: sugg.title,
        description: sugg.description,
        status: 'not_started',
        created_by: userId,
      });
      createdMilestones.push(ms);
    }

    return createdMilestones;
  }

  /**
   * Fetches decision log entries.
   */
  async getDecisions(workspaceId: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);
    return this.decisionRepo.getDecisions(workspaceId);
  }

  /**
   * Records a new decision log entry.
   */
  async createDecision(
    workspaceId: string,
    userId: string,
    data: { title: string; rationale: string },
  ) {
    await this.verifyWorkspaceAccess(workspaceId, userId);
    if (!data.title || data.title.trim() === '') {
      throw AppError.badRequest('Decision title is required');
    }
    if (!data.rationale || data.rationale.trim() === '') {
      throw AppError.badRequest('Decision rationale is required');
    }

    return this.decisionRepo.createDecision({
      workspace_id: workspaceId,
      title: data.title.trim(),
      rationale: data.rationale.trim(),
      decided_by: userId,
    });
  }

  /**
   * Fetches equity framework discussion topics with legal disclaimer.
   */
  async getEquityFramework(workspaceId: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);
    const dbTopics = await this.equityRepo.getTopics(workspaceId);
    const dbTopicMap = new Map(dbTopics.map((t) => [t.topic, t]));

    const topics = DEFAULT_EQUITY_TOPICS.map((def) => {
      const existing = dbTopicMap.get(def.topic);
      return {
        topic: def.topic,
        label: def.label,
        discussed: existing ? existing.discussed : false,
        discussed_at: existing ? existing.discussed_at : null,
      };
    });

    return {
      topics,
      disclaimer: LEGAL_DISCLAIMER,
    };
  }

  /**
   * Updates discussion status of an equity framework topic.
   */
  async updateEquityTopic(
    workspaceId: string,
    topic: string,
    discussed: boolean,
    userId: string,
  ) {
    await this.verifyWorkspaceAccess(workspaceId, userId);
    const validTopics = DEFAULT_EQUITY_TOPICS.map((t) => t.topic);
    if (!validTopics.includes(topic)) {
      throw AppError.badRequest(`Invalid topic '${topic}'. Allowed: ${validTopics.join(', ')}`);
    }

    const updated = await this.equityRepo.upsertTopic(workspaceId, topic, discussed);
    return {
      topic: updated.topic,
      discussed: updated.discussed,
      discussed_at: updated.discussed_at,
      disclaimer: LEGAL_DISCLAIMER,
    };
  }
}
