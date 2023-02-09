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

  app.get('/:id', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    /* Use first() to avoid returning an array when only one item is expected */
    const user = await knex('users').where('id', id).first()

    return {
      user,
    }
  })
}
