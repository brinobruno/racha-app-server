import { FastifyInstance } from 'fastify'

import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'
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
  app.post('/create', createUserHandler)

  app.post('/login', loginUserHandler)

  app.post('/logout/:id', logoutUserByIdHandler)

  app.get('/', getUsersHandler)

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists], // Middleware
    },
    getUserByIdHandler,
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists], // Middleware
    },
    deleteUserByIdHandler,
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists], // Middleware
    },
    updateUserByIdHandler,
  )

  // app.delete('/', async () => {
  //   return await knex.select('*').from('users').delete()
  // })
}
