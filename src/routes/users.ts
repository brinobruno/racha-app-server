import crypto from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { compare, hash } from 'bcryptjs'

import { knex } from './../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { getDaysAmountInMS } from '../utils/getDaysAmountInMS'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/create', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = createUserBodySchema.parse(request.body)

    const userAlreadyExists = await knex
      .select('email')
      .from('users')
      .where('email', email)
      .first()

    if (userAlreadyExists) {
      return reply.status(403).send({ message: 'User already exists' })
    }

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: getDaysAmountInMS(7), // 7 days in milliseconds
      })
    }

    const passwordHash = await hash(password, 8)

    const userToCreate = await knex('users')
      .insert({
        id: crypto.randomUUID(),
        email,
        password: passwordHash,
        session_id: sessionId,
      })
      .returning('id')

    return reply
      .status(201)
      .send({ message: 'User created successfully.', id: userToCreate[0].id })
  })

  app.get('/', async () => {
    const users = await knex('users').select('*')

    return {
      users,
    }
  })

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists], // Middleware
    },
    async (request, reply) => {
      const getUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getUserParamsSchema.parse(request.params)

      /* Use first() to avoid returning an array when only one item is expected */
      const user = await knex('users').where('id', id).first()

      return {
        user,
      }
    },
  )

  app.post('/login', async (request, reply) => {
    const loginUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = loginUserBodySchema.parse(request.body)

    const userExists = await knex
      .select('email', 'password')
      .from('users')
      .where('email', email)
      .first()

    if (!userExists) {
      return reply.status(422).send({ message: 'User does not exist' })
    }

    const matchPassword = await compare(password, userExists.password)

    if (!matchPassword) {
      return reply.status(401).send({ error: 'Incorrect email or password' })
    }

    return reply.status(200).send({ message: 'User logged in successfully' })
  })
}
