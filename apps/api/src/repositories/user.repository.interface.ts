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
  offering_tags?: string[];
  seeking_tags?: string[];
  experience_level: ExperienceLevel | null;
  commitment_level: CommitmentLevel | null;
  bio: string | null;
  github_username: string | null;
  device_public_key: string | null;
  offering_embedding?: number[];
  seeking_embedding?: number[];
  created_at: Date;
  updated_at: Date;
}

export type CreateUserInput = Pick<User, 'name' | 'email' | 'avatar_url' | 'provider' | 'provider_id'> & {
  githubUsername?: string;
};

export type UpdateUserInput = Partial<
  Pick<
    User,
    'name' | 'avatar_url' | 'skills' | 'offering_tags' | 'seeking_tags' | 'experience_level' | 'commitment_level' | 'bio'
  >
>;

export interface IUserRepository {
  create(input: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByProvider(provider: UserProvider, providerId: string): Promise<User | null>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  updateEmbeddings(id: string, offeringVector?: number[], seekingVector?: number[]): Promise<void>;
}
