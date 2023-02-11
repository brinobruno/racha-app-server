import { knex } from '../../database'

export async function findUsers() {
  return await knex('users').select('*')
}
