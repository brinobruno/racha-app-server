import { describe, expect, it, beforeAll, afterAll } from '@jest/globals'
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

  it('Should be able to create a new account', async () => {
    const response = await request(app.server).post('/users/create').send({
      email: 'account12@jest.com',
      password: 'weakpasssword123',
    })

    expect(response.statusCode).toBe(201)
  })

  it.todo('Should be able to list all users')
})
