import { FastifyInstance } from 'fastify'

import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'

export async function playersRoutes(app: FastifyInstance) {
  app.post(
    '/create/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async function () {
      return null
    },
  )
}
