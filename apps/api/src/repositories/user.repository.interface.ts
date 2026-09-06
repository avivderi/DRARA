export type UserProvider = 'google' | 'github';
export type ExperienceLevel = 'junior' | 'mid' | 'senior';
export type CommitmentLevel = 'full-time' | 'part-time' | 'weekends';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  provider: UserProvider;
  provider_id: string;
  skills: string[];
  experience_level: ExperienceLevel | null;
  commitment_level: CommitmentLevel | null;
  bio: string | null;
  github_username: string | null;
  device_public_key: string | null;
  offering_tags?: string[] | null;
  seeking_tags?: string[] | null;
  offering_embedding?: number[] | null;
  seeking_embedding?: number[] | null;
  created_at: Date;
  updated_at: Date;
}

export type CreateUserInput = Pick<User, 'name' | 'email' | 'provider' | 'provider_id'> & {
  avatar_url?: string | null;
  githubUsername?: string;
};

export type UpdateUserInput = Partial<
  Pick<User, 'name' | 'avatar_url' | 'skills' | 'experience_level' | 'commitment_level' | 'bio' | 'offering_tags' | 'seeking_tags'>
> & {
  offering_embedding?: number[] | null;
  seeking_embedding?: number[] | null;
};

export interface MatchedUserCandidate {
  user: User;
  similarityScore: number;
}

export interface IUserRepository {
  create(input: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByProvider(provider: UserProvider, providerId: string): Promise<User | null>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  findMatchingUsersForOfferingVector(
    seekingVector: number[],
    excludeUserId: string,
    limit?: number,
  ): Promise<MatchedUserCandidate[]>;
}
