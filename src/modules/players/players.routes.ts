import { FastifyInstance } from 'fastify'

import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'
import {
  createPlayerByIdHandler,
  getAllPlayersHandler,
  getPlayersByIdHandler,
} from './players.controllers'

export async function playersRoutes(app: FastifyInstance) {
  app.post(
    '/create/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    createPlayerByIdHandler,
  )

  app.get('/:id', getPlayersByIdHandler)

  app.get('/all', getAllPlayersHandler)
}
