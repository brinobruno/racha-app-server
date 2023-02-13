import { z } from 'zod'

export const createTeamBodySchema = z.object({
  title: z.string().min(2).max(255),
  owner: z.string().min(2).max(255),
  badgeUrl: z.string().optional(),
  active: z.boolean().default(true),
})
