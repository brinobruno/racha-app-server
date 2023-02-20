/* eslint-disable camelcase */
import crypto from 'node:crypto'
import { z } from 'zod'

import { knex } from '../../database'
import { createPlayerBodySchema } from './players.schemas'

export interface IPlayerRepository {
  createPlayerById(
    data: z.infer<typeof createPlayerBodySchema>,
    teamId: string | undefined,
  ): Promise<Array<{ id: string }>>
  findPlayersFromTeamId(teamId: string | undefined): Promise<any>
}

export const playerRepository: IPlayerRepository = {
  async createPlayerById(
    data: z.infer<typeof createPlayerBodySchema>,
    teamId: string | undefined,
  ) {
    return await knex('players')
      .insert({
        id: crypto.randomUUID(),
        team_id: teamId,
        ...data,
      })
      .returning('id')
  },

  async findPlayersFromTeamId(teamId: string) {
    return await knex('players').where({ team_id: teamId })
  },
}
