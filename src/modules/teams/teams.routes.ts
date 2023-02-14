import { FastifyInstance } from 'fastify'

import {
  createTeamHandler,
  deleteTeamByIdHandler,
  getTeamByIdHandler,
  getTeamsHandler,
  updateTeamByIdHandler,
} from './teams.controllers'
import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'

export async function teamsRoutes(app: FastifyInstance) {
  app.post(
    '/create',
    {
      preHandler: [checkSessionIdExists],
    },
    createTeamHandler,
  )

  app.get('/', getTeamsHandler)

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists], // Middleware
    },
    getTeamByIdHandler,
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
}
