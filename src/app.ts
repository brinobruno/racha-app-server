import fastify from 'fastify'
import { usersRoutes } from './modules/users/users.routes'
import cookie from '@fastify/cookie'

export const app = fastify()

/* Cookie is registered before so that it is accessible to everything past here */
app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})
