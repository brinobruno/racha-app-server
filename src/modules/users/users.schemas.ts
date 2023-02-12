import { z } from 'zod'

export function setUserParamsSchema() {
  return z.object({
    id: z.string().uuid(),
  })
}

export const createUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
