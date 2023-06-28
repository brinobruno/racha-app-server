// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      created_at: string
      updated_at: string
      deleted_at: string
      username: string
      email: string
      password: string
      active: boolean
    }

    teams: {
      id: string
      user_id: string
      created_at: string
      updated_at: string
      deleted_at: string
      title: string
      owner: string
      badge_url: string
      active: boolean
    }

    players: {
      id: string
      team_id: string
      created_at: string
      updated_at: string
      deleted_at: string
      name: string
      known_as: string
      picture_url: string
      position: string
      nationality: string
      overall: number
      pace: number
      shooting: number
      passing: number
      dribbling: number
      defending: number
      physical: number
      active: boolean
    }
  }
}
