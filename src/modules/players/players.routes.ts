import { FastifyInstance } from 'fastify'

import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'
import {
  createPlayerByIdHandler,
  deletePlayerByIdHandler,
  getAllPlayersHandler,
  getPlayerByIdHandler,
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

  app.get('/one/:id', getPlayerByIdHandler)

  app.get('/all', getAllPlayersHandler)

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists], // Middleware
    },
    deletePlayerByIdHandler,
  )

  // app.delete('/', async () => {
  //   return await knex.select('*').from('players').delete()
  // })
}
