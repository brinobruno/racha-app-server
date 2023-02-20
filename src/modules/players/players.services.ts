/* eslint-disable camelcase */
import { z } from 'zod'

import { createPlayerBodySchema } from './players.schemas'
import { playerRepository } from './players.repository'
import { HttpError } from '../../errors/customException'
import { teamRepository } from '../teams/teams.repository'

export async function createPlayer(
  input: z.infer<typeof createPlayerBodySchema>,
  teamId: string | undefined,
) {
  const playerToCreate = await playerRepository.createPlayerById(input, teamId)

  return playerToCreate
}

export async function findPlayers(teamId: string) {
  const team = await teamRepository.getTeamById(teamId)

  if (!team) throw new HttpError(404, 'Team not found')

  return await playerRepository.findPlayersFromTeamId(teamId)
}

export async function getAllPlayers() {
  try {
    return await playerRepository.findAllPlayers()
  } catch (error) {
    throw new Error()
  }
}
