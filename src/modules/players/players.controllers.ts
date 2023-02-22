import { FastifyReply, FastifyRequest } from 'fastify'

import {
  createPlayer,
  deletePlayer,
  findPlayers,
  getAllPlayers,
} from './players.services'
import { verifySessionId } from '../../helpers/verifySessionId'
import { createPlayerBodySchema } from './players.schemas'
import { setIdParamsSchema } from '../users/users.schemas'
import { getSessionById } from '../../helpers/getSessionById'
import { playerRepository } from './players.repository'
import { HttpError } from '../../errors/customException'

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
      createdPlayer,
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

export async function getPlayerByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId
  const getTeamParamsSchema = setIdParamsSchema()

  try {
    verifySessionId(sessionId)

    const { id: playerId } = getTeamParamsSchema.parse(request.params)

    const player = await playerRepository.getPlayerById(playerId)

    if (!player) throw new HttpError(404, 'Player not found')

    return reply.status(200).send({ player })
  } catch (error) {
    return reply.status(400).send({ message: 'Could not get player' })
  }
}

export async function getAllPlayersHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const players = await getAllPlayers()

    return reply.status(200).send({ players })
  } catch (error) {
    return reply.status(404).send({ message: 'No players found.' })
  }
}

export async function deletePlayerByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserParamsSchema = setIdParamsSchema()
  const sessionId = request.cookies.sessionId
  const { id: playerId } = getUserParamsSchema.parse(request.params)

  try {
    verifySessionId(sessionId)

    const session = await getSessionById(sessionId)
    const userId = session?.id

    await deletePlayer(playerId, userId)

    return reply.status(200).send({ message: 'Player deleted' })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    return reply.status(400).send({ error: 'Error deleting player' })
  }
}
