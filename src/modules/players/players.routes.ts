import { FastifyInstance } from 'fastify'

import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'
import { createPlayerByIdHandler } from './players.controllers'

export async function playersRoutes(app: FastifyInstance) {
  app.post(
    '/create/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    createPlayerByIdHandler,
  )
}
