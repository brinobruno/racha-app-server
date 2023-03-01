import fastify from 'fastify'
import { usersRoutes } from './modules/users/users.routes'
import cookie from '@fastify/cookie'
import { teamsRoutes } from './modules/teams/teams.routes'
import { playersRoutes } from './modules/players/players.routes'
import cors from '@fastify/cors'

export const app = fastify()

app.register(cors, {
  origin: 'http://localhost:3000',
})

/* Cookie is registered before so that it is accessible to everything past here */
app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(teamsRoutes, {
  prefix: 'users/teams',
})

app.register(playersRoutes, {
  prefix: 'users/teams/players',
})
