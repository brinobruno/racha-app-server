import fastify from 'fastify'
require('dotenv').config()

const app = fastify()

const PORT_NUMBER: number =
  parseInt(<string>process.env.PORT_NUMBER, 10) || 3333

app.get('/hello', () => {
  return 'Hello World'
})

app
  .listen({
    port: PORT_NUMBER,
  })
  .then(() => {
    console.log(`HTTP Server Running on port: ${PORT_NUMBER}`)
  })
