import { FastifyInstance } from 'fastify'

import { auth } from '../../middlewares/jwt-auth'
import {
  createPlayerByIdHandler,
  deletePlayerByIdHandler,
  getAllPlayersHandler,
  getPlayerByIdHandler,
  getPlayersByIdHandler,
  updatePlayerByIdHandler,
} from './players.controllers'

export async function playersRoutes(app: FastifyInstance) {
  app.post(
    '/create/:id',
    {
      preHandler: [auth],
    },
    createPlayerByIdHandler,
  )

  app.get(
    '/:id',
    {
      preHandler: [auth],
    },
    getPlayersByIdHandler,
  )

  app.get(
    '/one/:id',
    {
      preHandler: [auth],
    },
    getPlayerByIdHandler,
  )

  app.get(
    '/all',
    {
      preHandler: [auth],
    },
    getAllPlayersHandler,
  )

  app.delete(
    '/:id',
    {
      preHandler: [auth],
    },
    deletePlayerByIdHandler,
  )

  app.put(
    '/:id',
    {
      preHandler: [auth],
    },
    updatePlayerByIdHandler,
  )

  // app.delete('/', async () => {
  //   return await knex.select('*').from('players').delete()
  // })
}
