import { FastifyReply, FastifyRequest } from 'fastify'

import { createTeamBodySchema, setUserParamsSchema } from './teams.schemas'
import {
  createTeam,
  deleteTeamById,
  findTeamById,
  findTeams,
} from './teams.services'

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

export async function getTeamByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserParamsSchema = setUserParamsSchema()

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
  const getUserParamsSchema = setUserParamsSchema()

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
