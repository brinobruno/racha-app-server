import { FastifyInstance } from 'fastify'

import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'
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
      preHandler: [checkSessionIdExists],
    },
    createTeamByIdHandler,
  )

  app.get('/', getTeamsHandler)

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists], // Middleware
    },
    getTeamByIdHandler,
  )

  app.get(
    '/all/:id',
    {
      preHandler: [checkSessionIdExists], // Middleware
    },
    getTeamByUserIdHandler,
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists], // Middleware
    },
    deleteTeamByIdHandler,
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists], // Middleware
    },
    updateTeamByIdHandler,
  )

  // app.delete('/', async () => {
  //   return await knex.select('*').from('teams').delete()
  // })
}
