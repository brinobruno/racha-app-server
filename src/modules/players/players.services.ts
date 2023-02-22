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
import { compareIdsToBeEqual } from '../../helpers/compareIdsToBeEqual'

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

export async function deletePlayer(
  playerId: string,
  userId: string | undefined,
) {
  const playerExists = await playerRepository.getPlayerById(playerId)
  const teamId = playerExists.team_id
  const teamExists = await teamRepository.getTeamById(teamId)

  try {
    if (!teamExists) throw new HttpError(404, 'Team not found')
    if (!playerExists) {
      console.log(playerExists)
      throw new HttpError(404, 'Player not found')
    }

    // Check if the team's user_id matches the user's id
    compareIdsToBeEqual({ firstId: teamExists.user_id, secondId: userId })

    // Check if the player's team_id matches the team's id
    compareIdsToBeEqual({ firstId: teamExists.id, secondId: teamId })
  } catch (error) {
    throw new Error()
  }

  await playerRepository.deletePlayerById(playerId)
}
