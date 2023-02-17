import { FastifyReply, FastifyRequest } from 'fastify'

import { createTeamBodySchema, updateTeamBodySchema } from './teams.schemas'
import {
  createTeam,
  deleteTeamById,
  findTeamById,
  findTeams,
  updateTeam,
} from './teams.services'
import { setIdParamsSchema } from '../users/users.schemas'
import { getSessionById } from '../../middlewares/helpers/getSessionById'
import { verifySessionId } from '../../middlewares/helpers/verifySessionId'

export async function createTeamByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createTeamBodySchema.parse(request.body)
  const sessionId = request.cookies.sessionId

  try {
    verifySessionId(sessionId)

    const session = await getSessionById(sessionId)
    const userId = session?.id

    const createdTeam = await createTeam(body, userId)

    return reply
      .status(201)
      .send({ message: 'Team created successfully.', id: createdTeam[0].id })
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

export async function getTeamByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserParamsSchema = setIdParamsSchema()

  try {
    const { id } = getUserParamsSchema.parse(request.params)

    const team = await findTeamById(id)

    return reply.status(200).send({ message: 'Team found', team })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    reply.status(error.code).send({ error: error.message })
  }
}

export async function deleteTeamByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserParamsSchema = setIdParamsSchema()

  try {
    const { id } = getUserParamsSchema.parse(request.params)

    await deleteTeamById(id)

    return reply.status(200).send({ message: 'Team deleted' })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    reply.status(error.code).send({ error: error.message })
  }
}

export async function updateTeamByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getTeamParamsSchema = setIdParamsSchema()
  const body = updateTeamBodySchema.parse(request.body)
  const sessionId = request.cookies.sessionId
  const { id } = getTeamParamsSchema.parse(request.params)

  try {
    verifySessionId(sessionId)

    const session = await getSessionById(sessionId)
    const userId = session?.id

    const updatedTeam = await updateTeam(body, id, userId)

    return reply
      .status(200)
      .send({ message: 'Team updated successfully.', id: updatedTeam[0].id })
  } catch (error) {
    return reply.status(400).send({ error: 'Error updating team' })
  }
}
