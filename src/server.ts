import { env } from './env'
import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'

const app = fastify()

/* Cookie is registered before so that it is accessible to everything past here */
app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})

app
  .listen({
    port: env.PORT_NUMBER,
  })
  .then(() => {
    console.log(`HTTP Server Running on port: ${env.PORT_NUMBER}`)
  })
