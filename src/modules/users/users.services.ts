import { z } from 'zod'
import { compare, hash } from 'bcryptjs'

import { knex } from '../../database'
import {
  createUserBodySchema,
  loginUserBodySchema,
  updateUserBodySchema,
} from './users.schemas'
import { HttpError } from '../../errors/customException'
import { userRepository } from './users.repository'

export async function createUser(
  input: z.infer<typeof createUserBodySchema>,
  sessionId: string | undefined,
) {
  const { email, password } = input

  const userAlreadyExists = await userRepository.checkUserAlreadyExists(email)

  if (userAlreadyExists) {
    throw new Error()
  }

  const passwordHash = await hash(password, 8)

  const userToCreate = await userRepository.createUserAfterCheck(
    email,
    passwordHash,
    sessionId,
  )

  return userToCreate
}

export async function loginUser(
  input: z.infer<typeof loginUserBodySchema>,
  sessionId: string | undefined,
) {
  const { email, password } = input

  const userExists = await userRepository.checkUserAlreadyExistsForLogin(email)

  if (!userExists) {
    throw new HttpError(422, 'User does not exist')
  }

  const matchPassword = await compare(password, userExists.password)

  if (!matchPassword) {
    throw new HttpError(401, 'Incorrect email or password')
  }

  try {
    await userRepository.loginUserWithSessionId(email, sessionId)

    return userExists
  } catch (error) {
    throw new Error()
  }
}

export async function logoutUser(id: string, sessionId: string | undefined) {
  const userExists = await userRepository.findUserByIdAndSession(id, sessionId)

  if (!userExists) throw new HttpError(404, 'User not found')

  return await knex('users')
    .where('id', id)
    .update({ session_id: knex.raw('null') })
}

export async function findUser(id: string) {
  const user = await userRepository.findUserById(id)

  if (!user) throw new HttpError(404, 'User not found')

  return user
}

export async function deleteUser(id: string, sessionId: string | undefined) {
  const userExists = await userRepository.findUserByIdAndSession(id, sessionId)

  if (!userExists) throw new HttpError(404, 'User not found')

  return await userRepository.deleteUserById(id)
}

export async function updateUser(
  input: z.infer<typeof updateUserBodySchema>,
  id: string,
  sessionId: string | undefined,
) {
  const { email, password } = input

  const emailAlreadyExists = await userRepository.checkUserAlreadyExists(email)

  if (emailAlreadyExists) {
    throw new HttpError(400, 'Email already exists')
  }

  const passwordHash = await hash(password, 8)

  const updatedUser = await userRepository.updateUserById(id, {
    email,
    password: passwordHash,
    sessionId,
  })

  return updatedUser
}
