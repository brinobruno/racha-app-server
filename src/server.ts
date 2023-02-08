import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'
require('dotenv').config()

const app = fastify()

const PORT_NUMBER: number =
  parseInt(<string>process.env.PORT_NUMBER, 10) || 3333

app.get('/hello', async () => {
  const transaction = await knex('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transaction test 3',
    amount: 1000,
  })

  return transaction
})

app.get('/getdb', async () => {
  const transactions = await knex.select('*').from('transactions')

  return transactions
})

app
  .listen({
    port: PORT_NUMBER,
  })
  .then(() => {
    console.log(`HTTP Server Running on port: ${PORT_NUMBER}`)
  })
