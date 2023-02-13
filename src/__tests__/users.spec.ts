import request from 'supertest'
import { execSync } from 'node:child_process'
import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  beforeEach,
} from '@jest/globals'

import { app } from '../app'
import { compare } from 'bcryptjs'
import {
  USER_EMAIL,
  USER_PASSWORD,
  USER_UPDATED_EMAIL,
  USER_UPDATED_PASSWORD,
} from './repository'

describe('Users routes', () => {
  /* Make sure app (and thefore its routes) are done loading before testing */
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  // To always get a clean database on each test
  beforeEach(() => {
    execSync('yarn knex migrate:rollback --all')
    execSync('yarn knex migrate:latest')
  })

  it('Should be able to create a new account', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')
    const userId = createUserResponse.body.id

    const getUserResponse = await request(app.server)
      .get(`/users/${userId}`)
      .set('Cookie', cookies)
      .expect(200)

    const isPasswordCorrect = await compare(
      USER_PASSWORD,
      getUserResponse.body.user.password,
    )

    expect(isPasswordCorrect).toBe(true)

    expect(getUserResponse.body.user).toEqual(
      expect.objectContaining({
        email: USER_EMAIL,
      }),
    )
  })

  it('Should be able to login a user', async () => {
    const userCreated = await request(app.server).post('/users/create').send({
      email: USER_EMAIL,
      password: USER_PASSWORD,
    })

    expect(userCreated.statusCode).toBe(201)

    const authenticatedUser = await request(app.server)
      .post('/users/login')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })

    expect(authenticatedUser.statusCode).toBe(200)
  })

  it('Should be able to list all users', async () => {
    const response = await request(app.server).get('/users').expect(200)

    expect(response.body.users).toEqual([])
  })

  it('Should be able to list a user by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })

    const cookies = createUserResponse.get('Set-Cookie')
    const newUserId = createUserResponse.body.id

    const getUserResponse = await request(app.server)
      .get(`/users/${newUserId}`)
      .set('Cookie', cookies)
      .expect(200)

    const isPasswordCorrect = await compare(
      USER_PASSWORD,
      getUserResponse.body.user.password,
    )

    expect(isPasswordCorrect).toBe(true)

    expect(getUserResponse.body.user).toEqual(
      expect.objectContaining({
        email: USER_EMAIL,
      }),
    )
  })

  it('Should be able to delete a user by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })

    const cookies = createUserResponse.get('Set-Cookie')
    const newUserId = createUserResponse.body.id

    const deleteUserResponse = await request(app.server)
      .delete(`/users/${newUserId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(deleteUserResponse.statusCode).toBe(200)
  })

  it('Should be able to update a user by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })

    const cookies = createUserResponse.get('Set-Cookie')
    const userId = createUserResponse.body.id

    await request(app.server)
      .put(`/users/${userId}`)
      .set('Cookie', cookies)
      .send({
        email: USER_UPDATED_EMAIL,
        password: USER_UPDATED_PASSWORD,
      })
      .expect(200)

    const getUserResponse = await request(app.server)
      .get(`/users/${userId}`)
      .set('Cookie', cookies)
      .expect(200)

    const isPasswordCorrect = await compare(
      USER_UPDATED_PASSWORD,
      getUserResponse.body.user.password,
    )

    expect(getUserResponse.body.user.email).toBe(USER_UPDATED_EMAIL)
    expect(isPasswordCorrect).toBe(true)
  })
})
