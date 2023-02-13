import { FastifyReply, FastifyRequest } from 'fastify'

import { createTeamBodySchema } from './teams.schemas'
import { createTeam } from './teams.services'

export async function createTeamHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createTeamBodySchema.parse(request.body)
  const sessionId = request.cookies.sessionId

  try {
    const team = await createTeam(body, sessionId)

    return reply
      .status(201)
      .send({ message: 'Team created successfully.', id: team[0].id })
  } catch (error) {
    return reply.status(403).send({ error: 'Team already exists' })
  }
}
