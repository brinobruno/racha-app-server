import { FastifyReply, FastifyRequest } from 'fastify'

import { createPlayer, findPlayers } from './players.services'
import { verifySessionId } from '../../helpers/verifySessionId'
import { createPlayerBodySchema } from './players.schemas'
import { setIdParamsSchema } from '../users/users.schemas'

export async function createPlayerByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createPlayerBodySchema.parse(request.body)
  const sessionId = request.cookies.sessionId
  const getTeamParamsSchema = setIdParamsSchema()

  try {
    verifySessionId(sessionId)

    const { id: teamId } = getTeamParamsSchema.parse(request.params)

    const createdPlayer = await createPlayer(body, teamId)

    return reply.status(201).send({
      message: 'Player created successfully.',
      id: createdPlayer[0].id,
    })
  } catch (error) {
    return reply.status(403).send({ error: 'Error creating player' })
  }
}

export async function getPlayersByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId
  const getTeamParamsSchema = setIdParamsSchema()

  try {
    verifySessionId(sessionId)

    const { id: teamId } = getTeamParamsSchema.parse(request.params)

    const players = await findPlayers(teamId)

    return reply.status(200).send({ players })
  } catch (error) {
    return reply.status(404).send({ message: 'No players or team found.' })
  }
}
