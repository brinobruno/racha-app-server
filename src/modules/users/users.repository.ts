import crypto from 'node:crypto'
import { z } from 'zod'

import { knex } from '../../database'
import { updateUserBodySchema } from './users.schemas'

interface IUpdateOutput {
  id: string
}

interface ICheckUserForLoginOutput {
  email: string
  password: string
}

export interface IUserRepository {
  findUsers(): Promise<object[]>
  findUserById(id: string): Promise<unknown>
  findUserByIdAndSession(
    id: string,
    sessionId: string | undefined,
  ): Promise<unknown>
  checkUserEmailAlreadyExists(email: string): Promise<object | undefined>
  checkUsernameAlreadyExists(username: string): Promise<object | undefined>
  checkUserAlreadyExistsForLogin(
    email: string,
  ): Promise<ICheckUserForLoginOutput | undefined>
  createUserAfterCheck(
    username: string,
    email: string,
    passwordHash: string,
    sessionId: string | undefined,
  ): Promise<Array<{ user: string }>>
  loginUserWithSessionId(
    email: string,
    sessionId: string | undefined,
  ): Promise<any>
  logoutUserById(id: string): Promise<any>
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

  async findUserByIdAndSession(id: string, sessionId: string | undefined) {
    return await knex('users')
      .where('id', id)
      .andWhere('session_id', sessionId)
      .first()
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
      .select('email', 'password')
      .from('users')
      .where('email', email)
      .first()
  },

  async createUserAfterCheck(
    username: string,
    email: string,
    passwordHash: string,
    sessionId: string | undefined,
  ) {
    return await knex('users')
      .insert({
        id: crypto.randomUUID(),
        username,
        email,
        password: passwordHash,
        session_id: sessionId,
      })
      .returning(['id', 'username', 'email'])
  },

  async loginUserWithSessionId(email: string, sessionId: string | undefined) {
    return knex('users').where('email', email).update({
      session_id: sessionId,
    })
  },

  async logoutUserById(id: string) {
    return knex('users')
      .where('id', id)
      .update({ session_id: knex.raw('null') })
  },

  async updateUserById(
    id: string,
    {
      username,
      email,
      password,
      sessionId,
    }: z.infer<typeof updateUserBodySchema>,
  ) {
    return await knex('users')
      .where({ id })
      .update({ username, email, password, session_id: sessionId })
      .returning('id')
  },

  async deleteUserById(id: string) {
    return await knex('users').where('id', id).delete()
  },
}
