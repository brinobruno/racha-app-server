/* eslint-disable camelcase */
import crypto from 'node:crypto'
import { z } from 'zod'

import { knex } from '../../database'
import { createTeamBodySchema } from './teams.schemas'
import { HttpError } from '../../errors/customException'

export async function createTeam(input: z.infer<typeof createTeamBodySchema>) {
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
