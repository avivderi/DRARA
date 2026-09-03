import { randomUUID } from 'node:crypto';

import type {
  ConnectedRepo,
  CreateConnectedRepoInput,
  IConnectedRepoRepository,
} from './connected-repo.repository.interface';

export class FakeConnectedRepoRepository implements IConnectedRepoRepository {
  private readonly store = new Map<string, ConnectedRepo>();

  async create(input: CreateConnectedRepoInput): Promise<ConnectedRepo> {
    const now = new Date();
    const repo: ConnectedRepo = {
      id: randomUUID(),
      user_id: input.user_id,
      idea_id: input.idea_id ?? null,
      github_repo_full_name: input.github_repo_full_name,
      installation_id: input.installation_id,
      last_scanned_at: null,
      created_at: now,
      updated_at: now,
    };
    this.store.set(repo.id, repo);
    return structuredClone(repo);
  }

  async findByUserId(userId: string): Promise<ConnectedRepo[]> {
    return [...this.store.values()]
      .filter((item) => item.user_id === userId)
      .map((item) => structuredClone(item));
  }

  async findByRepoFullName(userId: string, repoFullName: string): Promise<ConnectedRepo | null> {
    for (const item of this.store.values()) {
      if (item.user_id === userId && item.github_repo_full_name === repoFullName) {
        return structuredClone(item);
      }
    }
    return null;
  }

  async findByIdeaId(ideaId: string): Promise<ConnectedRepo | null> {
    for (const item of this.store.values()) {
      if (item.idea_id === ideaId) return structuredClone(item);
    }
    return null;
  }

  async linkToIdea(id: string, ideaId: string): Promise<ConnectedRepo | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: ConnectedRepo = {
      ...existing,
      idea_id: ideaId,
      updated_at: new Date(),
    };
    this.store.set(id, updated);
    return structuredClone(updated);
  }

  async updateLastScanned(id: string): Promise<ConnectedRepo | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: ConnectedRepo = {
      ...existing,
      last_scanned_at: new Date(),
      updated_at: new Date(),
    };
    this.store.set(id, updated);
    return structuredClone(updated);
  }

  clear(): void {
    this.store.clear();
  }
}
