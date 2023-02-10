import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  beforeEach,
} from '@jest/globals'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'

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
    const response = await request(app.server).post('/users/create').send({
      email: 'account123456@jest.com',
      password: 'weakpasssword123',
    })

    expect(response.statusCode).toBe(201)
  })

  it('Should be able to list a user by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: 'accountjest@jest.com',
        password: 'weakpasssword123',
      })

    const cookies = createUserResponse.get('Set-Cookie')

    const listUserResponse = await request(app.server)
      .get('/users/dbd87ae4-2c02-4619-94f1-bb51b3502971')
      .set('Cookie', cookies)
      .expect(200)

    expect(listUserResponse.body.user).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        password: expect.any(String),
      }),
    )
  })

  it.todo('Should be able to list all users')
})
