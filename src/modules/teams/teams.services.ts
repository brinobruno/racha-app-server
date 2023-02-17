/* eslint-disable camelcase */
import { z } from 'zod'

import { createTeamBodySchema, updateTeamBodySchema } from './teams.schemas'
import { HttpError } from '../../errors/customException'
import { teamRepository } from './teams.repository'
import { compareIdsToBeEqual } from '../../middlewares/helpers/compareIdsToBeEqual'

export async function createTeam(
  input: z.infer<typeof createTeamBodySchema>,
  userId: string | undefined,
) {
  const { title, owner, badge_url } = input

  const teamAlreadyExists = await teamRepository.checkTeamAlreadyExists(title)

  if (teamAlreadyExists) {
    throw new Error()
  }

  const teamToCreate = await teamRepository.createTeamAfterCheck(
    userId,
    title,
    owner,
    badge_url,
  )

  return teamToCreate
}

export async function findTeam(teamId: string) {
  const team = await teamRepository.getTeamById(teamId)

  if (!team) throw new HttpError(404, 'Team not found')

  return team
}

export async function deleteTeam(teamId: string, userId: string | undefined) {
  const teamExists = await teamRepository.getTeamById(teamId)

  if (!teamExists) throw new HttpError(404, 'Team not found')

  // Check if the team's user_id matches the user's id
  compareIdsToBeEqual({ firstId: teamExists.user_id, secondId: userId })

  await teamRepository.deleteTeamById(teamId)
}

export async function updateTeam(
  input: z.infer<typeof updateTeamBodySchema>,
  teamId: string,
  userId: string | undefined,
) {
  const { title, owner, badge_url, active } = input

  const teamToUpdate = await teamRepository.getTeamById(teamId)

  // Check if the team's user_id matches the user's id
  compareIdsToBeEqual({ firstId: teamToUpdate.user_id, secondId: userId })

  const updatedTeam = await teamRepository.updateTeamById(teamId, {
    title,
    owner,
    badge_url,
    active,
  })

  return updatedTeam
}
