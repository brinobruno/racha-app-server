import fastify from 'fastify'

const app = fastify()

const PORT: number = 3333

app.get('/hello', () => {
  return 'Hello World'
})

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`HTTP Server Running on port: ${PORT}`)
  })
