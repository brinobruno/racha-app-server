import { FastifyRequest, FastifyReply } from 'fastify'

import { getSessionById } from './helper/getSessionById'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized: No session ID present',
    })
  }

  // Retrieve the session information from the database
  const session = await getSessionById(sessionId)

  if (!session) {
    return reply.status(401).send({
      error: 'Unauthorized: Invalid session ID',
    })
  }
}
