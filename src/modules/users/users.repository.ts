import { knex } from '../../database'

export interface IUserRepository {
  findUsers(): Promise<object[]>
}

export const userRepository: IUserRepository = {
  async findUsers() {
    return await knex('users').select('*')
  },
}
