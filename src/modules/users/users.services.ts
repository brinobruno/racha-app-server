import { z } from 'zod'
import { compare, hash } from 'bcryptjs'
import crypto from 'node:crypto'

import { knex } from '../../database'
import { createUserBodySchema, loginUserBodySchema } from './users.schemas'
import { HttpError } from '../../errors/customException'

export function setUserParamsSchema() {
  return z.object({
    id: z.string().uuid(),
  })
}

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

export async function loginUser(input: z.infer<typeof loginUserBodySchema>) {
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

  return userExists
}

export async function findUsers() {
  return await knex('users').select('*')
}

export async function findUserById(id: string) {
  /* Use first() to avoid returning an array when only one item is expected */
  return await knex('users').where('id', id).first()
}
