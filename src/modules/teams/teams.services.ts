/* eslint-disable camelcase */
import crypto from 'node:crypto'
import { z } from 'zod'

import { knex } from '../../database'
import { createTeamBodySchema } from './teams.schemas'

export async function createTeam(
  input: z.infer<typeof createTeamBodySchema>,
  sessionId: string | undefined,
) {
  const { title, owner, badgeUrl } = input

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
      badge_url: badgeUrl,
    })
    .returning('id')

  return teamToCreate
}

export async function findTeams() {
  return await knex('teams').select('*')
}
