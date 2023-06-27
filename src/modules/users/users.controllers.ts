import { FastifyReply, FastifyRequest } from 'fastify'
import crypto from 'node:crypto'

import { userRepository } from './users.repository'
import { verifySessionId } from '../../helpers/verifySessionId'
import { getDaysAmountInMS } from '../../utils/getDaysAmountInMS'
import { Constants } from '../../constants'
import {
  setIdParamsSchema,
  createUserBodySchema,
  loginUserBodySchema,
  updateUserBodySchema,
} from './users.schemas'
import {
  createUser,
  deleteUser,
  findUser,
  loginUser,
  logoutUser,
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
        maxAge: getDaysAmountInMS(Constants.SESSION_ID_MAX_AGE_DAYS_AMOUNT),
      })
    }

    const user = await createUser(body, sessionId)

    return reply.status(201).send({
      message: 'User created successfully.',
      user: user[0],
      sessionId,
    })
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
        maxAge: getDaysAmountInMS(Constants.SESSION_ID_MAX_AGE_DAYS_AMOUNT),
      })
    }

    const { user } = await loginUser(body, sessionId)

    return reply.status(200).send({
      message: 'User logged in successfully',
      user: user[0],
      sessionId,
    })
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

    await logoutUser(id)

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
  const users = await userRepository.findUsers()

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

    const user = await findUser(id)

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
  const sessionId = request.cookies.sessionId
  const { id } = getUserParamsSchema.parse(request.params)

  try {
    verifySessionId(sessionId)

    await deleteUser(id, sessionId)

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
    return reply.status(400).send({ error: 'Error updating user' })
  }
}
