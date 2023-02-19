import crypto from 'node:crypto'
import { z } from 'zod'

import { knex } from '../../database'
import { updateTeamBodySchema } from './teams.schemas'

interface IUpdateOutput {
  teamId: string
}

export interface ITeamRepository {
  findTeams(): Promise<object[]>
  getTeamById(id: string): Promise<any>
  checkTeamAlreadyExists(title: string): Promise<object>
  createTeamAfterCheck(
    userId: string | undefined,
    title: string,
    owner: string,
    badge_url: string | undefined,
  ): Promise<Array<{ id: string }>>
  updateTeamById(
    id: string,
    data: z.infer<typeof updateTeamBodySchema>,
  ): Promise<IUpdateOutput>
  deleteTeamById(id: string): Promise<void>
}

export const teamRepository: ITeamRepository = {
  async findTeams() {
    return await knex('teams').select('*')
  },

  async getTeamById(id: string) {
    return await knex('teams').where({ id }).first()
  },

  async checkTeamAlreadyExists(title: string) {
    return await knex
      .select('title')
      .from('teams')
      .where('title', title)
      .first()
  },

  async createTeamAfterCheck(
    userId: string | undefined,
    title: string,
    owner: string,
    badgeUrl: string | undefined,
  ) {
    return await knex('teams')
      .insert({
        id: crypto.randomUUID(),
        title,
        owner,
        badge_url: badgeUrl,
        user_id: userId,
      })
      .returning('id')
  },

  async updateTeamById(
    id: string,
    teamToUpdateData: z.infer<typeof updateTeamBodySchema>,
  ) {
    return await knex('teams')
      .where({ id })
      .update(teamToUpdateData)
      .returning('id')
  },

  async deleteTeamById(id: string) {
    return await knex('teams').where('id', id).delete()
  },
}
