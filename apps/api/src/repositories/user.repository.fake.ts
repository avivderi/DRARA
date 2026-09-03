import { randomUUID } from 'node:crypto';

import type {
  CreateUserInput,
  IUserRepository,
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
      avatar_url: input.avatar_url,
      provider: input.provider,
      provider_id: input.provider_id,
      github_username: input.githubUsername ?? null,
      skills: [],
      offering_tags: [],
      seeking_tags: [],
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

  async updateEmbeddings(id: string, offeringVector?: number[], seekingVector?: number[]): Promise<void> {
    const existing = this.store.get(id);
    if (!existing) return;
    if (offeringVector) existing.offering_embedding = offeringVector;
    if (seekingVector) existing.seeking_embedding = seekingVector;
    existing.updated_at = new Date();
    this.store.set(id, existing);
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
