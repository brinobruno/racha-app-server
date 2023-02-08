import { env } from './env'
import fastify from 'fastify'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(usersRoutes)

app
  .listen({
    port: env.PORT_NUMBER,
  })
  .then(() => {
    console.log(`HTTP Server Running on port: ${env.PORT_NUMBER}`)
  })
