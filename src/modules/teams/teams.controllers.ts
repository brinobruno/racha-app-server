import { FastifyReply, FastifyRequest } from 'fastify'

import { createTeamBodySchema } from './teams.schemas'
import { createTeam, findTeams } from './teams.services'

export async function createTeamHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createTeamBodySchema.parse(request.body)

  try {
    const team = await createTeam(body)

    return reply
      .status(201)
      .send({ message: 'Team created successfully.', id: team[0].id })
  } catch (error) {
    return reply.status(403).send({ error: 'Team already exists' })
  }
}

export async function getTeamsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const teams = await findTeams()

    return reply.status(200).send({ teams })
  } catch (error) {
    return reply.status(204).send({ message: 'No teams found.' })
  }
}
