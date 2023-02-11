import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'

import { createUserBodySchema } from './users.schemas'
import { getDaysAmountInMS } from '../../utils/getDaysAmountInMS'
import {
  createUser,
  findUserById,
  findUsers,
  loginUser,
  setUserParamsSchema,
} from './users.services'

export async function createUserHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createUserBodySchema.parse(request.body)
  let sessionId = request.cookies.sessionId

  try {
    const user = await createUser(body, sessionId)

    if (!sessionId) {
      sessionId = crypto.randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: getDaysAmountInMS(7), // 7 days in milliseconds
      })
    }

    return reply
      .status(201)
      .send({ message: 'User created successfully.', id: user[0].id })
  } catch (error) {
    return reply.status(403).send({ error: 'User already exists' })
  }
}

export async function getUsersHandler() {
  const users = await findUsers()

  return {
    users,
  }
}

export async function getUserByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserParamsSchema = setUserParamsSchema()

  const { id } = getUserParamsSchema.parse(request.params)

  const user = await findUserById(id)

  return {
    user,
  }
}

export async function loginUserHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const loginUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const body = loginUserBodySchema.parse(request.body)

  try {
    await loginUser(body)

    return reply.status(200).send({ message: 'User logged in successfully' })
  } catch (error: any) {
    reply.status(error.code).send({ error: error.message })
  }
}
