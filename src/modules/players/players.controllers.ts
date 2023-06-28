import { FastifyReply, FastifyRequest } from 'fastify'

import { setIdParamsSchema } from '../users/users.schemas'
import { playerRepository } from './players.repository'
import { HttpError } from '../../errors/customException'
import {
  createPlayer,
  deletePlayer,
  findPlayers,
  getAllPlayers,
  updatePlayer,
} from './players.services'
import {
  createPlayerBodySchema,
  updatePlayerBodySchema,
} from './players.schemas'

export async function createPlayerByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createPlayerBodySchema.parse(request.body)
  const getTeamParamsSchema = setIdParamsSchema()

  try {
    const { id: teamId } = getTeamParamsSchema.parse(request.params)

    const createdPlayer = await createPlayer(body, teamId)

    return reply.status(201).send({
      message: 'Player created successfully.',
      createdPlayer: createdPlayer[0],
    })
  } catch (error) {
    return reply.status(403).send({ error: 'Error creating player' })
  }
}

export async function getPlayersByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getTeamParamsSchema = setIdParamsSchema()

  try {
    const { id: teamId } = getTeamParamsSchema.parse(request.params)

    const players = await findPlayers(teamId)

    return reply.status(200).send({ players })
  } catch (error) {
    console.log(request.headers)
    return reply
      .status(404)
      .send({ message: 'No players or team found.', error })
  }
}

export async function getPlayerByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getTeamParamsSchema = setIdParamsSchema()

  try {
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
  const { id: playerId } = getUserParamsSchema.parse(request.params)

  try {
    await deletePlayer(playerId)

    return reply.status(200).send({ message: 'Player deleted' })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    return reply.status(400).send({ error: 'Error deleting player' })
  }
}

export async function updatePlayerByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getTeamParamsSchema = setIdParamsSchema()
  const body = updatePlayerBodySchema.parse(request.body)
  const { id: playerId } = getTeamParamsSchema.parse(request.params)

  try {
    const updatedPlayer = await updatePlayer(body, playerId)

    return reply
      .status(200)
      .send({ message: 'Player updated successfully.', updatedPlayer })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    return reply.status(400).send({ error: 'Error updating player' })
  }
}
