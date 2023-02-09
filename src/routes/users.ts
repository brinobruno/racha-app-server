import crypto from 'node:crypto'
import { knex } from './../database'
import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/create', async () => {
    const user = await knex('users')
      .insert({
        id: crypto.randomUUID(),
        email: 'brunosantos6ft@gmail.com',
        password: 'password123',
      })
      .returning('*')

    return user
  })
}
