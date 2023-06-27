import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { compare, hash } from 'bcryptjs'

import { HttpError } from '../../errors/customException'
import { userRepository } from './users.repository'
import {
  createUserBodySchema,
  loginUserBodySchema,
  updateUserBodySchema,
} from './users.schemas'
import { env } from '../../env'

const SECRET_KEY = env.JWT_SECRET_KEY

export async function createUser(
  input: z.infer<typeof createUserBodySchema>,
  sessionId: string | undefined,
) {
  const { username, email, password } = input

  const [userEmailAlreadyExists, usernameAlreadyExists] = await Promise.all([
    userRepository.checkUserEmailAlreadyExists(email),
    userRepository.checkUsernameAlreadyExists(username),
  ])

  if (usernameAlreadyExists || userEmailAlreadyExists) {
    const errorMessage = userEmailAlreadyExists
      ? 'Email already exists'
      : 'Username already exists'
    throw new HttpError(400, errorMessage)
  }

  const passwordHash = await hash(password, 8)

  const userToCreate = await userRepository.createUserAfterCheck(
    username,
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

  const matchPassword = await compare(password, userExists?.password)

  if (!matchPassword) {
    throw new HttpError(401, 'Incorrect email or password')
  }

  try {
    const user = await userRepository.checkUserAlreadyExistsForLogin(email)

    const token = jwt.sign(
      { id: user?.id?.toString(), email: user?.email },
      SECRET_KEY,
      {
        expiresIn: '2 days',
      },
    )

    return { user, token }
  } catch (error) {
    throw new Error()
  }
}

export async function logoutUser(id: string) {
  const userExists = await userRepository.findUserById(id)

  if (!userExists) throw new HttpError(404, 'User not found')

  return await userRepository.logoutUserById(id)
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
  const { username, email, password } = input

  const userEmailAlreadyExists =
    await userRepository.checkUserEmailAlreadyExists(email)

  const usernameAlreadyExists =
    await userRepository.checkUserEmailAlreadyExists(username)

  if (usernameAlreadyExists || userEmailAlreadyExists) {
    const errorMessage = userEmailAlreadyExists
      ? 'Email already exists'
      : 'Username already exists'
    throw new HttpError(400, errorMessage)
  }

  const passwordHash = await hash(password, 8)

  const updatedUser = await userRepository.updateUserById(id, {
    username,
    email,
    password: passwordHash,
    sessionId,
  })

  return updatedUser
}
