import request from 'supertest'
import { execSync } from 'node:child_process'
import {
  describe,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  expect,
} from '@jest/globals'

import { app } from '../app'
import {
  TEAM_BADGE_URL,
  TEAM_OWNER,
  TEAM_TITLE,
  USER_EMAIL,
  USER_PASSWORD,
} from '../mockup-repository'

describe('Teams routes', () => {
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

  it('Should be able to create a team', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/users/teams/create')
      .set('Cookie', cookies)
      .send({
        title: TEAM_TITLE,
        owner: TEAM_OWNER,
        badge_url: TEAM_BADGE_URL,
      })
      .expect(201)
  })

  it('Should be able to list teams if there are any', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/users/teams/create')
      .set('Cookie', cookies)
      .send({
        title: TEAM_TITLE,
        owner: TEAM_OWNER,
        badge_url: TEAM_BADGE_URL,
      })
      .expect(201)

    const getTeamsresponse = await request(app.server)
      .get('/users/teams')
      .expect(200)

    expect(getTeamsresponse.body.teams).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: TEAM_TITLE,
          owner: TEAM_OWNER,
          badge_url: TEAM_BADGE_URL,
        }),
      ]),
    )
  })

  it('Should be able to list teams if there are not any', async () => {
    const getTeamsresponse = await request(app.server)
      .get('/users/teams')
      .expect(200)

    expect(getTeamsresponse.body.teams).toEqual(expect.arrayContaining([]))
  })

  it('Should be able to delete a team by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })

    const cookies = createUserResponse.get('Set-Cookie')

    const createTeamResponse = await request(app.server)
      .post('/users/teams/create')
      .set('Cookie', cookies)
      .send({
        title: TEAM_TITLE,
        owner: TEAM_OWNER,
        badge_url: TEAM_BADGE_URL,
      })
      .expect(201)

    const newTeamId = createTeamResponse.body.id

    const deleteTeamResponse = await request(app.server)
      .delete(`/users/teams/${newTeamId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(deleteTeamResponse.statusCode).toBe(200)
  })
})
