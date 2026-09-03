import type { Request, Response } from 'express';
import { z } from 'zod';

import { db } from '../db/connection';
import { AppError } from '../lib/errors';
import { KnexUserRepository } from '../repositories/user.repository';

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().nullable().optional(),
  skills: z.array(z.string().min(1).max(50)).max(20).optional(),
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

    const { device_public_key: _, provider_id: __, ...safeUser } = updated;
    res.json(safeUser);
  },
};
