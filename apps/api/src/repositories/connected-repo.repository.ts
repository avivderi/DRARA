import type { Knex } from 'knex';

import type {
  ConnectedRepo,
  CreateConnectedRepoInput,
  IConnectedRepoRepository,
} from './connected-repo.repository.interface';

export class KnexConnectedRepoRepository implements IConnectedRepoRepository {
  constructor(private readonly db: Knex) {}

  async create(input: CreateConnectedRepoInput): Promise<ConnectedRepo> {
    const [repo] = await this.db<ConnectedRepo>('connected_repos')
      .insert({
        user_id: input.user_id,
        idea_id: input.idea_id ?? null,
        github_repo_full_name: input.github_repo_full_name,
        installation_id: input.installation_id,
      })
      .returning('*');

    if (!repo) throw new Error('Failed to create connected repo');
    return repo;
  }

  async findByUserId(userId: string): Promise<ConnectedRepo[]> {
    return this.db<ConnectedRepo>('connected_repos')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
  }

  async findByRepoFullName(userId: string, repoFullName: string): Promise<ConnectedRepo | null> {
    const repo = await this.db<ConnectedRepo>('connected_repos')
      .where({ user_id: userId, github_repo_full_name: repoFullName })
      .first();
    return repo ?? null;
  }

  async findByIdeaId(ideaId: string): Promise<ConnectedRepo | null> {
    const repo = await this.db<ConnectedRepo>('connected_repos')
      .where({ idea_id: ideaId })
      .first();
    return repo ?? null;
  }

  async linkToIdea(id: string, ideaId: string): Promise<ConnectedRepo | null> {
    const [updated] = await this.db<ConnectedRepo>('connected_repos')
      .where({ id })
      .update({ idea_id: ideaId, updated_at: this.db.fn.now() })
      .returning('*');
    return updated ?? null;
  }

  async updateLastScanned(id: string): Promise<ConnectedRepo | null> {
    const [updated] = await this.db<ConnectedRepo>('connected_repos')
      .where({ id })
      .update({ last_scanned_at: this.db.fn.now(), updated_at: this.db.fn.now() })
      .returning('*');
    return updated ?? null;
  }
}
