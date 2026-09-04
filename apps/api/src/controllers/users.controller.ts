import type { Request, Response } from 'express';
import { z } from 'zod';

import { db } from '../db/connection';
import { AppError } from '../lib/errors';
import { KnexUserRepository } from '../repositories/user.repository';
import { EmbeddingServiceClient } from '../services/embedding-service.client';

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().nullable().optional(),
  skills: z.array(z.string().min(1).max(50)).max(20).optional(),
  offering_tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  seeking_tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  experience_level: z.enum(['junior', 'mid', 'senior']).nullable().optional(),
  commitment_level: z.enum(['full-time', 'part-time', 'weekends']).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
});

export const usersController = {
  getMe: async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw AppError.unauthorized();

    const userRepo = new KnexUserRepository(db);
    const user = await userRepo.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    // Strip sensitive fields before sending
    const { device_public_key: _, provider_id: __, ...safeUser } = user;
    res.json(safeUser);
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
        const offeringTags = updated.offering_tags ?? [];
        const seekingTags = updated.seeking_tags ?? [];
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
};
