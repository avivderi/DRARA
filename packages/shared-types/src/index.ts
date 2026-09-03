// Shared types consumed by api, mobile, and web
// Add more as modules are built

export type UserProvider = 'google' | 'github';
export type ExperienceLevel = 'junior' | 'mid' | 'senior';
export type CommitmentLevel = 'full-time' | 'part-time' | 'weekends';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  provider: UserProvider;
  skills: string[];
  experience_level: ExperienceLevel | null;
  commitment_level: CommitmentLevel | null;
  bio: string | null;
  github_username: string | null;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

export interface HealthResponse {
  status: 'ok';
  service: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  code?: string;
}
