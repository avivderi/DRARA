import type { Request, Response } from 'express';
import { z } from 'zod';

import { db } from '../db/connection';
import { AppError } from '../lib/errors';
import { KnexUserRepository } from '../repositories/user.repository';
import { EmbeddingServiceClient } from '../services/embedding-service.client';

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  headline: z.string().max(200).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  skills: z.array(z.string().min(1).max(50)).max(20).optional(),
  offering_tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  seeking_tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  experience_level: z.enum(['junior', 'mid', 'senior']).nullable().optional(),
  commitment_level: z.enum(['full-time', 'part-time', 'weekends']).nullable().optional(),
  availability_hours_per_week: z.number().min(0).max(168).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
});

export const usersController = {
  getMe: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const userRepo = new KnexUserRepository(db);
    const user = await userRepo.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      provider: user.provider,
      skills: user.skills,
      experience_level: user.experience_level,
      commitment_level: user.commitment_level,
      bio: user.bio,
      github_username: user.github_username,
      offering_tags: user.offering_tags,
      seeking_tags: user.seeking_tags,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    res.json(safeUser);
  },

  getFullProfile: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const userRepo = new KnexUserRepository(db);
    const user = await userRepo.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      provider: user.provider,
      skills: user.skills,
      experience_level: user.experience_level,
      commitment_level: user.commitment_level,
      bio: user.bio,
      github_username: user.github_username,
      offering_tags: user.offering_tags,
      seeking_tags: user.seeking_tags,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    res.json({
      user: safeUser,
      offering_tags: user.offering_tags ?? [],
      seeking_tags: user.seeking_tags ?? [],
      bio: user.bio ?? null,
      headline: (user as unknown as Record<string, unknown>)['headline'] ?? null,
      availability_hours_per_week: (user as unknown as Record<string, unknown>)['availability_hours_per_week'] ?? null,
    });
  },

  updateMe: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const parsed = UpdateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      throw AppError.badRequest(parsed.error.message, 'VALIDATION_ERROR');
    }

    const userRepo = new KnexUserRepository(db);
    const updated = await userRepo.update(userId, parsed.data);
    if (!updated) throw AppError.notFound('User not found');

    // Automatically trigger vector embedding regeneration when tags or bio are updated
    if (parsed.data.offering_tags !== undefined || parsed.data.seeking_tags !== undefined || parsed.data.bio !== undefined) {
      try {
        const embeddingClient = new EmbeddingServiceClient();
        const offeringTags: string[] = updated.offering_tags ?? [];
        const seekingTags: string[] = updated.seeking_tags ?? [];
        const bio = updated.bio ?? '';

        let offeringVector: number[] | undefined;
        let seekingVector: number[] | undefined;

        if (offeringTags.length > 0 || bio) {
          offeringVector = await embeddingClient.generateEmbedding([...offeringTags, bio].filter(Boolean).join(' '));
        }
        if (seekingTags.length > 0 || bio) {
          seekingVector = await embeddingClient.generateEmbedding([...seekingTags, bio].filter(Boolean).join(' '));
        }

        if (offeringVector || seekingVector) {
          await userRepo.update(userId, { offering_embedding: offeringVector, seeking_embedding: seekingVector });
        }
      } catch (err) {
        // Non-blocking embedding update failure log
      }
    }

    const { device_public_key: _, provider_id: __, ...safeUser } = updated;
    res.json(safeUser);
  },

  getPartnerships: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const rows = await db('matches')
      .leftJoin('ideas', 'matches.idea_id', 'ideas.id')
      .leftJoin('workspaces', 'matches.id', 'workspaces.match_id')
      .leftJoin('handshake_events', 'matches.id', 'handshake_events.match_id')
      .leftJoin('users as u1', 'matches.user1_id', 'u1.id')
      .leftJoin('users as u2', 'matches.user2_id', 'u2.id')
      .where('matches.status', 'confirmed')
      .andWhere((builder) => {
        void builder.where('matches.user1_id', userId).orWhere('matches.user2_id', userId);
      })
      .select(
        'matches.id as match_id',
        'matches.created_at as match_created_at',
        'ideas.title as idea_title',
        'ideas.summary as idea_summary',
        'workspaces.id as workspace_id',
        'handshake_events.created_at as handshake_date',
        'matches.user1_id',
        'matches.user2_id',
        'u1.name as u1_name',
        'u1.avatar_url as u1_avatar',
        'u2.name as u2_name',
        'u2.avatar_url as u2_avatar',
      );

    const partnerships = rows.map((r) => {
      const isUser1 = r.user1_id === userId;
      const partnerName = isUser1 ? r.u2_name : r.u1_name;
      const partnerAvatar = isUser1 ? r.u2_avatar : r.u1_avatar;
      const myAvatar = isUser1 ? r.u1_avatar : r.u2_avatar;

      return {
        id: r.match_id,
        workspaceId: r.workspace_id ?? null,
        ideaTitle: r.idea_title ?? 'Co-Founding Project',
        tagline: r.idea_summary ?? 'Confirmed Co-Founding Partnership',
        partnerName: partnerName ?? 'Co-Founder Partner',
        partnerAvatar: partnerAvatar ?? null,
        myAvatar: myAvatar ?? null,
        handshakeDate: r.handshake_date
          ? new Date(r.handshake_date).toLocaleDateString('he-IL')
          : new Date(r.match_created_at).toLocaleDateString('he-IL'),
        isConfirmed: true,
      };
    });

    res.json({ partnerships });
  },
};
