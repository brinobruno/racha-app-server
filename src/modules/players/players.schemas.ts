/* eslint-disable no-unused-vars */
import { z } from 'zod'

export const createPlayerBodySchema = z.object({
  name: z.string().min(2).max(25),
  known_as: z.string().min(2).max(25).optional(),
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
  overall: z.number().int().optional(),
  pace: z.number().int().optional(),
  shooting: z.number().int().optional(),
  passing: z.number().int().optional(),
  dribbling: z.number().int().optional(),
  defending: z.number().int().optional(),
  physical: z.number().int().optional(),
})

export const updatePlayerBodySchema = z.object({
  name: z.string().min(2).max(25),
  known_as: z.string().min(2).max(25).optional(),
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
  overall: z.number().int().optional(),
  pace: z.number().int().optional(),
  shooting: z.number().int().optional(),
  passing: z.number().int().optional(),
  dribbling: z.number().int().optional(),
  defending: z.number().int().optional(),
  physical: z.number().int().optional(),
})

export enum DEFENDER_OR_ATTACKER_POSITIONS {
  CB = 'CB',
  LW = 'LW',
  RW = 'RW',
  ST = 'ST',
}

export type PlayerStats = Record<string, number | undefined>
