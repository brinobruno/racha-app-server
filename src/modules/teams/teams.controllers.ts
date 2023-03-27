import { FastifyReply, FastifyRequest } from 'fastify'

import { teamRepository } from './teams.repository'
import { setIdParamsSchema } from '../users/users.schemas'
import { verifySessionId } from '../../helpers/verifySessionId'
import { getSessionById } from '../../helpers/getSessionById'
import { createTeamBodySchema, updateTeamBodySchema } from './teams.schemas'
import {
  createTeam,
  deleteTeam,
  findTeam,
  findTeamsByUserId,
  updateTeam,
} from './teams.services'

export async function createTeamByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createTeamBodySchema.parse(request.body)
  const sessionId = request.cookies.sessionId
  const getUserParamsSchema = setIdParamsSchema()
  const { id: userId } = getUserParamsSchema.parse(request.params)

  try {
    verifySessionId(sessionId)

    const createdTeam = await createTeam(body, userId)

    return reply
      .status(201)
      .send({ message: 'Team created successfully.', id: createdTeam[0].id })
  } catch (error) {
    return reply.status(403).send({ error: 'Error creating team' })
  }
}

export async function getTeamsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const teams = await teamRepository.findTeams()

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
    const { id: teamId } = getUserParamsSchema.parse(request.params)

    const team = await findTeam(teamId)

    return reply.status(200).send({ message: 'Team found', team })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    reply.status(error.code).send({ error: error.message })
  }
}

export async function getTeamByUserIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserParamsSchema = setIdParamsSchema()

  try {
    const { id: userId } = getUserParamsSchema.parse(request.params)

    const teams = await findTeamsByUserId(userId)

    return reply.status(200).send({ message: 'Teams found', teams })
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
  const sessionId = request.cookies.sessionId
  const { id: teamId } = getUserParamsSchema.parse(request.params)

  try {
    verifySessionId(sessionId)

    const session = await getSessionById(sessionId)
    const userId = session?.id

    await deleteTeam(teamId, userId)

    return reply.status(200).send({ message: 'Team deleted' })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    return reply.status(400).send({ error: 'Error deleting team' })
  }
}

export async function updateTeamByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getTeamParamsSchema = setIdParamsSchema()
  const body = updateTeamBodySchema.parse(request.body)
  const sessionId = request.cookies.sessionId
  const { id: teamId } = getTeamParamsSchema.parse(request.params)

  try {
    verifySessionId(sessionId)

    const session = await getSessionById(sessionId)
    const userId = session?.id

    await updateTeam(body, teamId, userId)

    return reply
      .status(200)
      .send({ message: 'Team updated successfully.', teamId })
  } catch (error: any) {
    if (error.message.includes('Invalid uuid')) {
      return reply.status(400).send({ error: 'Invalid UUID format' })
    }

    return reply.status(400).send({ error: 'Error updating team' })
  }
}
