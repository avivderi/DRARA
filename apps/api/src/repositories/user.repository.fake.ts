import { randomUUID } from 'node:crypto';

import type {
  CreateUserInput,
  IUserRepository,
  MatchedUserCandidate,
  UpdateUserInput,
  User,
  UserProvider,
} from './user.repository.interface';

/** In-memory fake repository — used exclusively in tests. No DB required. */
export class FakeUserRepository implements IUserRepository {
  private readonly store = new Map<string, User>();

  async create(input: CreateUserInput): Promise<User> {
    const now = new Date();
    const user: User = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      avatar_url: input.avatar_url ?? null,
      provider: input.provider,
      provider_id: input.provider_id,
      github_username: input.githubUsername ?? null,
      skills: [],
      experience_level: null,
      commitment_level: null,
      bio: null,
      device_public_key: null,
      created_at: now,
      updated_at: now,
    };
    this.store.set(user.id, user);
    return structuredClone(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = this.store.get(id);
    return user ? structuredClone(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.email === email) return structuredClone(user);
    }
    return null;
  }

  async findByProvider(provider: UserProvider, providerId: string): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.provider === provider && user.provider_id === providerId) {
        return structuredClone(user);
      }
    }
    return null;
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: User = { ...existing, ...input, updated_at: new Date() };
    this.store.set(id, updated);
    return structuredClone(updated);
  }

  async findMatchingUsersForOfferingVector(
    seekingVector: number[],
    excludeUserId: string,
    limit: number = 10,
  ): Promise<MatchedUserCandidate[]> {
    const candidates: MatchedUserCandidate[] = [];

    for (const user of this.store.values()) {
      if (user.id === excludeUserId || !user.offering_embedding) continue;

      // Cosine similarity = (A dot B) / (|A| * |B|)
      let dot = 0;
      let magA = 0;
      let magB = 0;
      const offVec = user.offering_embedding;
      const minLen = Math.min(seekingVector.length, offVec.length);

      for (let i = 0; i < minLen; i++) {
        const a = seekingVector[i] ?? 0;
        const b = offVec[i] ?? 0;
        dot += a * b;
        magA += a * a;
        magB += b * b;
      }

      const sim = magA > 0 && magB > 0 ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
      candidates.push({ user: structuredClone(user), similarityScore: sim });
    }

    candidates.sort((a, b) => b.similarityScore - a.similarityScore);
    return candidates.slice(0, limit);
  }

  /** Test helper: reset store between tests */
  clear(): void {
    this.store.clear();
  }

  /** Test helper: get all stored users */
  all(): User[] {
    return [...this.store.values()].map((u) => structuredClone(u));
  }
}
