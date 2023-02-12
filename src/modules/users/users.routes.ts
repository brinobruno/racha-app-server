import { FastifyInstance } from 'fastify'

import {
  createUserHandler,
  deleteUserByIdHandler,
  getUserByIdHandler,
  getUsersHandler,
  loginUserHandler,
} from './users.controllers'
import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/create', createUserHandler)

  app.post('/login', loginUserHandler)

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
}
