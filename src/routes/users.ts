import crypto from 'node:crypto'
import { knex } from './../database'
import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const transaction = await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title: 'Transaction test 3',
        amount: 1000,
      })
      .returning('*')

    return transaction
  })

  app.get('/getdb', async () => {
    const transactions = await knex.select('*').from('transactions')

    return transactions
  })
}
