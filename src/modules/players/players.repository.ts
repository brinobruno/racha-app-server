/* eslint-disable camelcase */
import crypto from 'node:crypto'

import { knex } from '../../database'
import { z } from 'zod'
import { createPlayerBodySchema } from './players.schemas'

export interface IPlayerRepository {
  createPlayerById(
    data: z.infer<typeof createPlayerBodySchema>,
    teamId: string | undefined,
  ): Promise<Array<{ id: string }>>
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
}
