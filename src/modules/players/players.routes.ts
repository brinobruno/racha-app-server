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
      preHandler: [auth], // Middleware
    },
    getPlayersByIdHandler,
  )

  app.get(
    '/one/:id',
    {
      preHandler: [auth], // Middleware
    },
    getPlayerByIdHandler,
  )

  app.get(
    '/all',
    {
      preHandler: [auth], // Middleware
    },
    getAllPlayersHandler,
  )

  app.delete(
    '/:id',
    {
      preHandler: [auth], // Middleware
    },
    deletePlayerByIdHandler,
  )

  app.put(
    '/:id',
    {
      preHandler: [auth], // Middleware
    },
    updatePlayerByIdHandler,
  )

  // app.delete('/', async () => {
  //   return await knex.select('*').from('players').delete()
  // })
}
