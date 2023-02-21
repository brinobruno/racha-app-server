import { z } from 'zod'

import {
  DEFENDER_OR_ATTACKER_POSITIONS,
  PlayerStats,
  createPlayerBodySchema,
} from './players.schemas'
import { playerRepository } from './players.repository'
import { teamRepository } from '../teams/teams.repository'
import { transformPlayerStats } from '../../helpers/transformPlayerStats'
import { HttpError } from '../../errors/customException'

export async function createPlayer(
  {
    overall,
    position,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physical,
    ...rest
  }: z.infer<typeof createPlayerBodySchema>,
  teamId: string | undefined,
) {
  const playerStats: PlayerStats = {
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physical,
  }

  const isDefenderOrAttacker = position in DEFENDER_OR_ATTACKER_POSITIONS

  const transformedStats = transformPlayerStats(
    playerStats,
    overall,
    isDefenderOrAttacker,
  )

  const input = {
    ...rest,
    overall,
    position,
    ...transformedStats,
  }

  const playerToCreate = await playerRepository.createPlayerById(input, teamId)

  return playerToCreate
}

export async function findPlayers(teamId: string) {
  try {
    const team = await teamRepository.getTeamById(teamId)

    if (!team) throw new HttpError(404, 'Team not found')

    return await playerRepository.findPlayersFromTeamId(teamId)
  } catch (error) {
    throw new Error()
  }
}

export async function getAllPlayers() {
  try {
    return await playerRepository.findAllPlayers()
  } catch (error) {
    throw new Error()
  }
}
