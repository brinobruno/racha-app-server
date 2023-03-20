import { FastifyRequest, FastifyReply } from 'fastify'

import { getSessionById } from '../helpers/getSessionById'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = await request.headers.cookies

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized: No session ID present',
    })
  } // Retrieve the session information from the database

  const session = await getSessionById(sessionId.toString())

  if (!session) {
    return reply.status(401).send({
      error: 'Unauthorized: Invalid session ID',
    })
  }
}
