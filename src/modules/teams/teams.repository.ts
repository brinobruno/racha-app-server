import { z } from 'zod'
import { knex } from '../../database'
import { updateTeamBodySchema } from './teams.schemas'

interface IUpdateOutput {
  teamId: string
}

export interface ITeamRepository {
  getTeamById(id: string): Promise<any>
  updateTeamById(
    id: string,
    data: z.infer<typeof updateTeamBodySchema>,
  ): Promise<IUpdateOutput>
  deleteTeamById(id: string): Promise<void>
}

export const teamRepository: ITeamRepository = {
  async getTeamById(id: string): Promise<any> {
    return await knex('teams').where({ id }).first()
  },

  async updateTeamById(
    id: string,
    teamToCreateData: any,
  ): Promise<IUpdateOutput> {
    return await knex('teams')
      .where({ id })
      .update(teamToCreateData)
      .returning('id')
  },

  async deleteTeamById(id: string) {
    return await knex('teams').where('id', id).delete()
  },
}
