import { z } from 'zod'
import { hash } from 'bcryptjs'
import crypto from 'node:crypto'

import { knex } from '../../database'
import { createUserBodySchema } from './users.schemas'

export async function findUsers() {
  return await knex('users').select('*')
}

export async function findUserById(id: string) {
  /* Use first() to avoid returning an array when only one item is expected */
  return await knex('users').where('id', id).first()
}

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
