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
        email: 'account123456@jest.com',
        password: 'weakpasssword123',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')
    const userId = createUserResponse.body.id

    const getUserResponse = await request(app.server)
      .get(`/users/${userId}`)
      .set('Cookie', cookies)
      .expect(200)

    const isPasswordCorrect = await compare(
      'weakpasssword123',
      getUserResponse.body.user.password,
    )

    expect(isPasswordCorrect).toBe(true)

    expect(getUserResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'account123456@jest.com',
      }),
    )
  })

  it('Should be able to login a user', async () => {
    const userCreated = await request(app.server).post('/users/create').send({
      email: 'account@jest.com',
      password: 'weakpassword123',
    })

    expect(userCreated.statusCode).toBe(201)

    const authenticatedUser = await request(app.server)
      .post('/users/login')
      .send({
        email: 'account@jest.com',
        password: 'weakpassword123',
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
        email: 'accountjest@jest.com',
        password: 'weakpasssword123',
      })

    const cookies = createUserResponse.get('Set-Cookie')
    const newUserId = createUserResponse.body.id

    const listUserResponse = await request(app.server)
      .get(`/users/${newUserId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(listUserResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'accountjest@jest.com',
        password: expect.any(String),
      }),
    )
  })

  it('Should be able to delete a user by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: 'accountjest@jest.com',
        password: 'weakpasssword123',
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
        email: 'account123456@jest.com',
        password: 'weakpasssword123',
      })

    const cookies = createUserResponse.get('Set-Cookie')
    const userId = createUserResponse.body.id

    await request(app.server)
      .put(`/users/${userId}`)
      .set('Cookie', cookies)
      .send({
        email: 'updatedemail@jest.com',
        password: 'strongerpassword456',
      })
      .expect(200)

    const getUserResponse = await request(app.server)
      .get(`/users/${userId}`)
      .set('Cookie', cookies)
      .expect(200)

    const isPasswordCorrect = await compare(
      'strongerpassword456',
      getUserResponse.body.user.password,
    )

    expect(getUserResponse.body.user.email).toBe('updatedemail@jest.com')
    expect(isPasswordCorrect).toBe(true)
  })
})
