import { FastifyReply, FastifyRequest } from 'fastify'
import crypto from 'node:crypto'

import {
  setIdParamsSchema,
  createUserBodySchema,
  loginUserBodySchema,
  updateUserBodySchema,
} from './users.schemas'
import { getDaysAmountInMS } from '../../utils/getDaysAmountInMS'
import {
  createUser,
  deleteUserById,
  findUserById,
  findUsers,
  loginUser,
  logoutUserById,
  updateUser,
} from './users.services'

export async function createUserHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createUserBodySchema.parse(request.body)
  let sessionId = request.cookies.sessionId

  try {
    if (!sessionId) {
      sessionId = crypto.randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: getDaysAmountInMS(7), // 7 days in milliseconds
      })
    }

    const user = await createUser(body, sessionId)

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
  const body = loginUserBodySchema.parse(request.body)
  let sessionId = request.cookies.sessionId

  try {
    if (!sessionId) {
      sessionId = crypto.randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: getDaysAmountInMS(7), // 7 days in milliseconds
      })
    }

    await loginUser(body, sessionId)

    return reply.status(200).send({ message: 'User logged in successfully' })
  } catch (error: any) {
    reply.status(error.code).send({ error: error.message })
  }
}

export async function logoutUserByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserParamsSchema = setIdParamsSchema()

  try {
    const { id } = getUserParamsSchema.parse(request.params)
    const sessionId = request.cookies.sessionId

    await logoutUserById(id, sessionId)

    reply.cookie('sessionId', '', {
      path: '/',
    })

    return reply.status(200).send({ message: 'User logged out' })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    return reply.status(400).send({ message: 'Could not log out user' })
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
  const getUserParamsSchema = setIdParamsSchema()

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
  const getUserParamsSchema = setIdParamsSchema()

  try {
    const { id } = getUserParamsSchema.parse(request.params)
    const sessionId = request.cookies.sessionId

    await deleteUserById(id, sessionId)

    reply.cookie('sessionId', '', {
      path: '/',
    })

    return reply.status(200).send({ message: 'User deleted' })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    reply.status(error.code).send({ error: error.message })
  }
}

export async function updateUserByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserParamsSchema = setIdParamsSchema()

  const body = updateUserBodySchema.parse(request.body)

  try {
    const { id } = getUserParamsSchema.parse(request.params)
    const sessionId = request.cookies.sessionId

    const updatedUser = await updateUser(body, id, sessionId)

    return reply
      .status(200)
      .send({ message: 'User updated successfully.', id: updatedUser[0].id })
  } catch (error) {
    console.log(error)
    return reply.status(400).send({ error: 'Error updating user' })
  }
}
