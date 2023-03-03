import { z } from 'zod'

export function setIdParamsSchema() {
  return z.object({
    id: z.string().uuid(),
  })
}

export const createUserBodySchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export const updateUserBodySchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  sessionId: z.string().optional(),
})

export const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
