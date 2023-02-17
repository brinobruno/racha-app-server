/* eslint-disable camelcase */
import crypto from 'node:crypto'
import { z } from 'zod'

import { knex } from '../../database'
import { createTeamBodySchema, updateTeamBodySchema } from './teams.schemas'
import { HttpError } from '../../errors/customException'
import { teamRepository } from './teams.repository'

export async function createTeam(
  input: z.infer<typeof createTeamBodySchema>,
  userId: string | undefined,
) {
  const { title, owner, badge_url } = input

  const teamAlreadyExists = await knex
    .select('title')
    .from('teams')
    .where('title', title)
    .first()

  if (teamAlreadyExists) {
    throw new Error()
  }

  const teamToCreate = await knex('teams')
    .insert({
      id: crypto.randomUUID(),
      title,
      owner,
      badge_url,
      user_id: userId,
    })
    .returning('id')

  return teamToCreate
}

export async function findTeams() {
  return await knex('teams').select('*')
}

export async function findTeamById(id: string) {
  const team = await knex('teams').where('id', id).first()

  if (!team) throw new HttpError(404, 'Team not found')

  return team
}

export async function deleteTeamById(id: string, userId: string | undefined) {
  const teamExists = await knex('teams').where('id', id).first()

  if (Object.keys(teamExists).length === 0)
    throw new HttpError(404, 'Team not found')

  // Check if the team's user_id matches the user's id
  if (teamExists.user_id !== userId) {
    throw new HttpError(
      401,
      'Permission denied, ID from user does not match team user_id ',
    )
  }

  await knex('teams').where('id', id).delete()

  return {}
}

export async function updateTeam(
  input: z.infer<typeof updateTeamBodySchema>,
  teamId: string,
  userId: string | undefined,
) {
  const { title, owner, badge_url, active } = input

  // const teamToUpdate = await knex('teams').where({ id }).first()
  const teamToUpdate = await teamRepository.getTeamById(teamId)

  // Check if the team's user_id matches the user's id
  if (teamToUpdate.user_id !== userId) {
    throw new HttpError(
      401,
      'Permission denied, ID from user does not match team user_id ',
    )
  }

  // const updatedTeam = await knex('teams')
  //   .where({ id })
  //   .update({
  //     title,
  //     owner,
  //     badge_url,
  //     active,
  //   })
  //   .returning('id')

  const updatedTeam = await teamRepository.updateTeamById(teamId, {
    title,
    owner,
    badge_url,
    active,
  })

  return updatedTeam
}
