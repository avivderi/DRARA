export interface ConnectedRepo {
  id: string;
  user_id: string;
  idea_id: string | null;
  github_repo_full_name: string;
  installation_id: string;
  last_scanned_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export type CreateConnectedRepoInput = Pick<
  ConnectedRepo,
  'user_id' | 'github_repo_full_name' | 'installation_id'
> & {
  idea_id?: string;
};

export interface IConnectedRepoRepository {
  create(input: CreateConnectedRepoInput): Promise<ConnectedRepo>;
  findByUserId(userId: string): Promise<ConnectedRepo[]>;
  findByRepoFullName(userId: string, repoFullName: string): Promise<ConnectedRepo | null>;
  findByIdeaId(ideaId: string): Promise<ConnectedRepo | null>;
  linkToIdea(id: string, ideaId: string): Promise<ConnectedRepo | null>;
  updateLastScanned(id: string): Promise<ConnectedRepo | null>;
}
