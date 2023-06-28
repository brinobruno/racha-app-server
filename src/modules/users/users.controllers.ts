import { FastifyReply, FastifyRequest } from 'fastify'

import { userRepository } from './users.repository'
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

  try {
    const user = await createUser(body)

    return reply.status(201).send({
      message: 'User created successfully.',
      user: user[0],
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

  try {
    const { user, token } = await loginUser(body)

    return reply.status(200).send({
      message: 'User logged in successfully',
      user,
      token,
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
  const { id } = getUserParamsSchema.parse(request.params)

  try {
    await deleteUser(id)

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

    const updatedUser = await updateUser(body, id)

    return reply
      .status(200)
      .send({ message: 'User updated successfully.', id: updatedUser[0].id })
  } catch (error) {
    return reply.status(400).send({ error: 'Error updating user' })
  }
}
