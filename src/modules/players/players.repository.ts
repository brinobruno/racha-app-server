/* eslint-disable camelcase */
import crypto from 'node:crypto'
import { z } from 'zod'

import { knex } from '../../database'
import {
  createPlayerBodySchema,
  updatePlayerBodySchema,
} from './players.schemas'

export interface IPlayerRepository {
  createPlayerById(
    data: z.infer<typeof createPlayerBodySchema>,
    teamId: string | undefined,
  ): Promise<Array<{ id: string }>>
  findPlayersFromTeamId(teamId: string | undefined): Promise<any>
  findAllPlayers(): Promise<object[]>
  getPlayerById(id: string): Promise<any>
  deletePlayerById(id: string): Promise<void>
  updateUserById(
    data: z.infer<typeof updatePlayerBodySchema>,
    playerId: string | undefined,
  ): Promise<any>
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
      .returning('*')
  },

  async findPlayersFromTeamId(teamId: string) {
    return await knex('players').where({ team_id: teamId })
  },

  async findAllPlayers() {
    return await knex('players').select('*')
  },

  async getPlayerById(id: string) {
    return await knex('players').where({ id }).first()
  },

  async deletePlayerById(id: string) {
    return await knex('players').where('id', id).delete()
  },

  async updateUserById(
    data: z.infer<typeof updatePlayerBodySchema>,
    playerId: string | undefined,
  ) {
    return await knex('players')
      .where({ id: playerId })
      .update(data)
      .returning('*')
  },
}
