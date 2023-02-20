import { z } from 'zod'

export const createPlayerBodySchema = z.object({
  name: z.string().min(2).max(25),
  known_as: z.string().min(2).max(25),
  nationality: z.string().optional(),
  active: z.boolean().default(true),

  position: z.enum([
    'GK',
    'CB',
    'LB',
    'RB',
    'CDM',
    'CM',
    'CAM',
    'LW',
    'RW',
    'ST',
  ]),
  overall: z.number().int(),
  pace: z.number().int(),
  shooting: z.number().int(),
  passing: z.number().int(),
  dribbling: z.number().int(),
  defending: z.number().int(),
  physical: z.number().int(),
})
