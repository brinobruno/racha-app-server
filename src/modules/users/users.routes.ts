import { FastifyInstance } from 'fastify'

import { auth } from '../../middlewares/jwt-auth'
import {
  createUserHandler,
  deleteUserByIdHandler,
  getUserByIdHandler,
  getUsersHandler,
  loginUserHandler,
  logoutUserByIdHandler,
  updateUserByIdHandler,
} from './users.controllers'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/signup', createUserHandler)

  app.post('/login', loginUserHandler)

  app.post(
    '/logout/:id',
    {
      preHandler: [auth],
    },
    logoutUserByIdHandler,
  )

  app.get('/', { preHandler: [auth] }, getUsersHandler)

  app.get(
    '/:id',
    {
      preHandler: [auth],
    },
    getUserByIdHandler,
  )

  app.delete(
    '/:id',
    {
      preHandler: [auth],
    },
    deleteUserByIdHandler,
  )

  app.put(
    '/:id',
    {
      preHandler: [auth],
    },
    updateUserByIdHandler,
  )

  // app.delete('/', async () => {
  //   return await knex.select('*').from('users').delete()
  // })
}
