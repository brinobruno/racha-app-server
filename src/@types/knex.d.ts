// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      created_at: string
      updated_at: string
      deleted_at: string
      email: string
      password: string
      active: boolean
    }
  }
}
