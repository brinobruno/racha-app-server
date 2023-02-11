import { z } from 'zod'
import { knex } from '../../database'

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
