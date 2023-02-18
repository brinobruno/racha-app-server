import { z } from 'zod'
import { compare, hash } from 'bcryptjs'
import crypto from 'node:crypto'

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

  const userAlreadyExists = await knex
    .select('email')
    .from('users')
    .where('email', email)
    .first()

  if (userAlreadyExists) {
    throw new Error()
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

  return userToCreate
}

export async function loginUser(
  input: z.infer<typeof loginUserBodySchema>,
  sessionId: string | undefined,
) {
  const { email, password } = input

  const userExists = await knex
    .select('email', 'password')
    .from('users')
    .where('email', email)
    .first()

  if (!userExists) {
    throw new HttpError(422, 'User does not exist')
  }

  const matchPassword = await compare(password, userExists.password)

  if (!matchPassword) {
    throw new HttpError(401, 'Incorrect email or password')
  }

  try {
    await knex('users').where('email', email).update({
      session_id: sessionId,
    })

    return userExists
  } catch (error) {
    throw new Error()
  }
}

export async function logoutUserById(
  id: string,
  sessionId: string | undefined,
) {
  const userExists = await knex('users')
    .where('id', id)
    .andWhere('session_id', sessionId)
    .first()

  if (!userExists) throw new HttpError(404, 'User not found')

  await knex('users')
    .where('id', id)
    .update({ session_id: knex.raw('null') })

  return {}
}

export async function findUser(id: string) {
  const user = await userRepository.findUserById(id)

  if (!user) throw new HttpError(404, 'User not found')

  return user
}

export async function deleteUserById(
  id: string,
  sessionId: string | undefined,
) {
  const userExists = await knex('users')
    .where('id', id)
    .andWhere('session_id', sessionId)

  if (Object.keys(userExists).length === 0)
    throw new HttpError(404, 'User not found')

  await knex('users').where('id', id).delete()

  return {}
}

export async function updateUser(
  input: z.infer<typeof updateUserBodySchema>,
  id: string,
  sessionId: string | undefined,
) {
  const { email, password } = input

  const emailAlreadyExists = await knex('users')
    .select()
    .where('email', email)
    .first()

  if (emailAlreadyExists) {
    throw new Error()
  }

  const userToUpdate = await knex('users')
    .where({ id })
    .update({
      email,
      password: password ? await hash(password, 8) : undefined,
      session_id: sessionId,
    })
    .returning('id')

  return userToUpdate
}
