import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.string(),
  PORT_NUMBER: z.number(),
})

export const env = envSchema.parse(process.env)
