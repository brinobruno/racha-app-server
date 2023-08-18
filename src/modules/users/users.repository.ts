import crypto from 'node:crypto'
import { z } from 'zod'

import { knex } from '../../database'
import { updateUserBodySchema } from './users.schemas'

interface IUpdateOutput {
  id: string
}

interface ICheckUserForLoginOutput {
  id: string
  email: string
  password: string
}

export interface IUserRepository {
  findUsers(): Promise<object[]>
  findUserById(id: string): Promise<unknown>
  checkUserEmailAlreadyExists(email: string): Promise<object | undefined>
  checkUsernameAlreadyExists(username: string): Promise<object | undefined>
  checkUserAlreadyExistsForLogin(
    email: string,
  ): Promise<ICheckUserForLoginOutput | undefined>
  createUserAfterCheck(
    username: string,
    email: string,
    passwordHash: string,
  ): Promise<Array<{ user: any }>>
  updateUserById(
    id: string,
    data: z.infer<typeof updateUserBodySchema>,
  ): Promise<Array<IUpdateOutput>>
  deleteUserById(id: string): Promise<void>
}

export const userRepository: IUserRepository = {
  async findUsers() {
    return await knex('users').select('*')
  },

  async findUserById(id: string) {
    return await knex('users').where({ id }).first()
  },

  async checkUserEmailAlreadyExists(email: string) {
    return await knex
      .select('email')
      .from('users')
      .where('email', email)
      .first()
  },

  async checkUsernameAlreadyExists(username: string) {
    return await knex
      .select('username')
      .from('users')
      .where('username', username)
      .first()
  },

  async checkUserAlreadyExistsForLogin(email: string) {
    return await knex
      .select('id', 'username', 'email', 'password')
      .from('users')
      .where('email', email)
      .first()
      .returning(['id', 'username', 'email', 'password'])
  },

  async createUserAfterCheck(
    username: string,
    email: string,
    passwordHash: string,
  ) {
    return await knex('users')
      .insert({
        id: crypto.randomUUID(),
        username,
        email,
        password: passwordHash,
      })
      .returning(['id', 'username', 'email'])
  },

  async updateUserById(
    id: string,
    { username, email, password }: z.infer<typeof updateUserBodySchema>,
  ) {
    return await knex('users')
      .where({ id })
      .update({ username, email, password })
      .returning('id')
  },

  async deleteUserById(id: string) {
    return await knex('users').where('id', id).delete()
  },
}
