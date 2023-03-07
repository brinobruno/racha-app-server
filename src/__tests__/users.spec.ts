import request from 'supertest'
import { execSync } from 'node:child_process'
import { compare } from 'bcryptjs'
import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  beforeEach,
} from '@jest/globals'

import { app } from '../app'
import { USER_REPOSITORY } from '../mockup-repository'

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
      .post('/api/v1/users/create')
      .send({
        username: USER_REPOSITORY.USER_USERNAME,
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')
    const userId = createUserResponse.body.id

    const getUserResponse = await request(app.server)
      .get(`/api/v1/users/${userId}`)
      .set('Cookie', cookies)
      .expect(200)

    const isPasswordCorrect = await compare(
      USER_REPOSITORY.USER_PASSWORD,
      getUserResponse.body.user.password,
    )

    expect(isPasswordCorrect).toBe(true)

    expect(getUserResponse.body.user).toEqual(
      expect.objectContaining({
        username: USER_REPOSITORY.USER_USERNAME,
        email: USER_REPOSITORY.USER_EMAIL,
      }),
    )
  })

  it('Should be able to login a user', async () => {
    const userCreated = await request(app.server)
      .post('/api/v1/users/create')
      .send({
        username: USER_REPOSITORY.USER_USERNAME,
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
      })

    expect(userCreated.statusCode).toBe(201)

    const authenticatedUser = await request(app.server)
      .post('/api/v1/users/login')
      .send({
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
      })

    expect(authenticatedUser.statusCode).toBe(200)
  })

  it('Should be able to logout a user by id', async () => {
    const userCreated = await request(app.server)
      .post('/api/v1/users/create')
      .send({
        username: USER_REPOSITORY.USER_USERNAME,
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
      })

    expect(userCreated.statusCode).toBe(201)

    const newUserId = userCreated.body.id
    const cookies = userCreated.get('Set-Cookie')

    const authenticatedUser = await request(app.server)
      .post('/api/v1/users/login')
      .set('Cookie', cookies)
      .send({
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
      })

    expect(authenticatedUser.statusCode).toBe(200)

    const userToLogout = await request(app.server)
      .post(`/api/v1/users/logout/${newUserId}`)
      .set('Cookie', cookies)
      .expect(200)

    const updatedCookies = userToLogout.get('Set-Cookie')

    expect(updatedCookies).toEqual(['sessionId=; Path=/'])
  })

  it('Should be able to list all users', async () => {
    const response = await request(app.server).get('/api/v1/users').expect(200)

    expect(response.body.users).toEqual([])
  })

  it('Should be able to list a user by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/api/v1/users/create')
      .send({
        username: USER_REPOSITORY.USER_USERNAME,
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
      })

    const cookies = createUserResponse.get('Set-Cookie')
    const newUserId = createUserResponse.body.id

    const getUserResponse = await request(app.server)
      .get(`/api/v1/users/${newUserId}`)
      .set('Cookie', cookies)
      .expect(200)

    const isPasswordCorrect = await compare(
      USER_REPOSITORY.USER_PASSWORD,
      getUserResponse.body.user.password,
    )

    expect(isPasswordCorrect).toBe(true)

    expect(getUserResponse.body.user).toEqual(
      expect.objectContaining({
        username: USER_REPOSITORY.USER_USERNAME,
        email: USER_REPOSITORY.USER_EMAIL,
      }),
    )
  })

  it('Should be able to delete a user by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/api/v1/users/create')
      .send({
        username: USER_REPOSITORY.USER_USERNAME,
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
      })

    const cookies = createUserResponse.get('Set-Cookie')
    const newUserId = createUserResponse.body.id

    const deleteUserResponse = await request(app.server)
      .delete(`/api/v1/users/${newUserId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(deleteUserResponse.statusCode).toBe(200)
  })

  it('Should be able to update a user by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/api/v1/users/create')
      .send({
        username: USER_REPOSITORY.USER_USERNAME,
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
      })

    const cookies = createUserResponse.get('Set-Cookie')
    const userId = createUserResponse.body.id

    await request(app.server)
      .put(`/api/v1/users/${userId}`)
      .set('Cookie', cookies)
      .send({
        username: USER_REPOSITORY.UPDATED_USER_USERNAME,
        email: USER_REPOSITORY.UPDATED_USER_EMAIL,
        password: USER_REPOSITORY.UPDATED_USER_PASSWORD,
      })
      .expect(200)

    const getUserResponse = await request(app.server)
      .get(`/api/v1/users/${userId}`)
      .set('Cookie', cookies)
      .expect(200)

    const isPasswordCorrect = await compare(
      USER_REPOSITORY.UPDATED_USER_PASSWORD,
      getUserResponse.body.user.password,
    )

    expect(getUserResponse.body.user.email).toBe(
      USER_REPOSITORY.UPDATED_USER_EMAIL,
    )
    expect(getUserResponse.body.user.username).toBe(
      USER_REPOSITORY.UPDATED_USER_USERNAME,
    )
    expect(isPasswordCorrect).toBe(true)
  })
})
