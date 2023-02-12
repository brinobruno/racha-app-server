import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'

import { setUserParamsSchema, createUserBodySchema } from './users.schemas'
import { getDaysAmountInMS } from '../../utils/getDaysAmountInMS'
import {
  createUser,
  deleteUserById,
  findUserById,
  findUsers,
  loginUser,
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

  try {
    const { id } = getUserParamsSchema.parse(request.params)

    const user = await findUserById(id)

    return reply.status(200).send({ message: 'User found', user })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    reply.status(error.code).send({ error: error.message })
  }
}

export async function deleteUserByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserParamsSchema = setUserParamsSchema()

  try {
    const { id } = getUserParamsSchema.parse(request.params)

    await deleteUserById(id)

    return reply.status(200).send({ message: 'User deleted' })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    reply.status(error.code).send({ error: error.message })
  }
}
