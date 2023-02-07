import fastify from 'fastify'
import { knex } from './database'
require('dotenv').config()

const app = fastify()

const PORT_NUMBER: number =
  parseInt(<string>process.env.PORT_NUMBER, 10) || 3333

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*')

  return tables
})

app
  .listen({
    port: PORT_NUMBER,
  })
  .then(() => {
    console.log(`HTTP Server Running on port: ${PORT_NUMBER}`)
  })
