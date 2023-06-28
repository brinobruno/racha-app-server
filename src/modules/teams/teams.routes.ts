import { FastifyInstance } from 'fastify'

import { auth } from '../../middlewares/jwt-auth'
import {
  createTeamByIdHandler,
  deleteTeamByIdHandler,
  getTeamByIdHandler,
  getTeamByUserIdHandler,
  getTeamsHandler,
  updateTeamByIdHandler,
} from './teams.controllers'

export async function teamsRoutes(app: FastifyInstance) {
  app.post(
    '/create/:id',
    {
      preHandler: [auth],
    },
    createTeamByIdHandler,
  )

  app.get(
    '/',
    {
      preHandler: [auth],
    },
    getTeamsHandler,
  )

  app.get(
    '/:id',
    {
      preHandler: [auth],
    },
    getTeamByIdHandler,
  )

  app.get(
    '/all/:id',
    {
      preHandler: [auth],
    },
    getTeamByUserIdHandler,
  )

  app.delete(
    '/:id',
    {
      preHandler: [auth],
    },
    deleteTeamByIdHandler,
  )

  app.put(
    '/:id',
    {
      preHandler: [auth],
    },
    updateTeamByIdHandler,
  )

  // app.delete('/', async () => {
  //   return await knex.select('*').from('teams').delete()
  // })
}
