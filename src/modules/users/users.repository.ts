import { knex } from '../../database'
import crypto from 'node:crypto'

export interface IUserRepository {
  findUsers(): Promise<object[]>
  findUserById(id: string): Promise<unknown>
  checkUserAlreadyExists(email: string): Promise<object | undefined>
  createUserAfterCheck(
    email: string,
    passwordHash: string,
    sessionId: string | undefined,
  ): Promise<Array<{ id: string }>>
}

export const userRepository: IUserRepository = {
  async findUsers() {
    return await knex('users').select('*')
  },

  async findUserById(id: string) {
    return await knex('users').where({ id }).first()
  },

  async checkUserAlreadyExists(email: string) {
    return await knex
      .select('email')
      .from('users')
      .where('email', email)
      .first()
  },

  async createUserAfterCheck(
    email: string,
    passwordHash: string,
    sessionId: string | undefined,
  ) {
    return await knex('users')
      .insert({
        id: crypto.randomUUID(),
        email,
        password: passwordHash,
        session_id: sessionId,
      })
      .returning('id')
  },
}
