import { z } from 'zod'

export const createTeamBodySchema = z.object({
  title: z.string().min(2).max(255),
  owner: z.string().min(2).max(255),
  badge_url: z.string().optional(),
  active: z.boolean().default(true),
})

export const updateTeamBodySchema = z.object({
  title: z.string().min(2).max(255),
  owner: z.string().min(2).max(255),
  badge_url: z.string().optional(),
  active: z.boolean().default(true),
})
