import { z } from 'zod'

import { playerRepository } from './players.repository'
import { teamRepository } from '../teams/teams.repository'
import { compareIdsToBeEqual } from '../../helpers/compareIdsToBeEqual'
import { transformPlayerStats } from '../../helpers/transformPlayerStats'
import { HttpError } from '../../errors/customException'
import {
  DEFENDER_OR_ATTACKER_POSITIONS,
  PlayerStats,
  createPlayerBodySchema,
  updatePlayerBodySchema,
} from './players.schemas'

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

export async function deletePlayer(playerId: string) {
  const playerExists = await playerRepository.getPlayerById(playerId)
  const teamId = playerExists.team_id
  const teamExists = await teamRepository.getTeamById(teamId)

  try {
    if (!teamExists) throw new HttpError(404, 'Team not found')
    if (!playerExists) throw new HttpError(404, 'Player not found')

    // Check if the player's team_id matches the team's id
    compareIdsToBeEqual({ firstId: teamExists.id, secondId: teamId })
  } catch (error) {
    throw new Error()
  }

  await playerRepository.deletePlayerById(playerId)
}

export async function updatePlayer(
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
  }: z.infer<typeof updatePlayerBodySchema>,
  playerId: string,
) {
  const playerExists = await playerRepository.getPlayerById(playerId)
  const teamId = playerExists.team_id
  const teamExists = await teamRepository.getTeamById(teamId)

  try {
    if (!teamExists) throw new HttpError(404, 'Team not found')
    if (!playerExists) throw new HttpError(404, 'Player not found')

    // Check if the player's team_id matches the team's id
    compareIdsToBeEqual({ firstId: teamExists.id, secondId: teamId })

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

    const updatedUser = playerRepository.updateUserById(input, playerId)

    return updatedUser
  } catch (error) {
    throw new Error()
  }
}
