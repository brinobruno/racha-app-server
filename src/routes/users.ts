import crypto from 'node:crypto'
import { knex } from './../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/create', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = createUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: crypto.randomUUID(),
      email,
      password,
    })

    return reply.status(201).send({ message: 'User created successfully.' })
  })

  app.get('/', async () => {
    const users = await knex('users').select('*')

    return {
      users,
    }
  })
}
