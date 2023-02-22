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
  PLAYER_REPOSITORY,
  TEAM_REPOSITORY,
  USER_EMAIL,
  USER_PASSWORD,
} from '../mockup-repository'

describe('Players routes', () => {
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

  it('Should be able to create a player by user id', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')
    const userId = createUserResponse.body.id

    const createTeamResponse = await request(app.server)
      .post(`/users/teams/create/${userId}`)
      .set('Cookie', cookies)
      .send({
        title: TEAM_REPOSITORY.TEAM_TITLE,
        owner: TEAM_REPOSITORY.TEAM_OWNER,
        badge_url: TEAM_REPOSITORY.TEAM_BADGE_URL,
        user_id: userId,
      })
      .expect(201)

    const teamId = createTeamResponse.body.id

    await request(app.server)
      .post(`/users/teams/players/create/${teamId}`)
      .set('Cookie', cookies)
      .send({
        name: PLAYER_REPOSITORY.PLAYER_NAME,
        known_as: PLAYER_REPOSITORY.PLAYER_KNOWN_AS,
        nationality: PLAYER_REPOSITORY.PLAYER_NATIONALITY,
        position: PLAYER_REPOSITORY.PLAYER_POSITION,
        overall: PLAYER_REPOSITORY.PLAYER_OVERALL,
        team_id: teamId,
      })
      .expect(201)
  })

  it('Should be able to list all players', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')
    const userId = createUserResponse.body.id

    const createTeamResponse = await request(app.server)
      .post(`/users/teams/create/${userId}`)
      .set('Cookie', cookies)
      .send({
        title: TEAM_REPOSITORY.TEAM_TITLE,
        owner: TEAM_REPOSITORY.TEAM_OWNER,
        badge_url: TEAM_REPOSITORY.TEAM_BADGE_URL,
        user_id: userId,
      })
      .expect(201)

    const teamId = createTeamResponse.body.id

    await request(app.server)
      .post(`/users/teams/players/create/${teamId}`)
      .set('Cookie', cookies)
      .send({
        name: PLAYER_REPOSITORY.PLAYER_NAME,
        known_as: PLAYER_REPOSITORY.PLAYER_KNOWN_AS,
        nationality: PLAYER_REPOSITORY.PLAYER_NATIONALITY,
        position: PLAYER_REPOSITORY.PLAYER_POSITION,
        overall: PLAYER_REPOSITORY.PLAYER_OVERALL,
        team_id: teamId,
      })
      .expect(201)

    const getPlayersResponse = await request(app.server)
      .get('/users/teams/players/all')
      .expect(200)

    expect(getPlayersResponse.body.players).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: PLAYER_REPOSITORY.PLAYER_NAME,
          known_as: PLAYER_REPOSITORY.PLAYER_KNOWN_AS,
          nationality: PLAYER_REPOSITORY.PLAYER_NATIONALITY,
          position: PLAYER_REPOSITORY.PLAYER_POSITION,
          overall: PLAYER_REPOSITORY.PLAYER_OVERALL,
          team_id: teamId,
        }),
      ]),
    )
  })

  it('Should be able to list all players in a team', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')
    const userId = createUserResponse.body.id

    const createTeamResponse = await request(app.server)
      .post(`/users/teams/create/${userId}`)
      .set('Cookie', cookies)
      .send({
        title: TEAM_REPOSITORY.TEAM_TITLE,
        owner: TEAM_REPOSITORY.TEAM_OWNER,
        badge_url: TEAM_REPOSITORY.TEAM_BADGE_URL,
        user_id: userId,
      })
      .expect(201)

    const teamId = createTeamResponse.body.id

    await request(app.server)
      .post(`/users/teams/players/create/${teamId}`)
      .set('Cookie', cookies)
      .send({
        name: PLAYER_REPOSITORY.PLAYER_NAME,
        known_as: PLAYER_REPOSITORY.PLAYER_KNOWN_AS,
        nationality: PLAYER_REPOSITORY.PLAYER_NATIONALITY,
        position: PLAYER_REPOSITORY.PLAYER_POSITION,
        overall: PLAYER_REPOSITORY.PLAYER_OVERALL,
        team_id: teamId,
      })
      .expect(201)

    const getPlayersFromOneTeamResponse = await request(app.server)
      .get(`/users/teams/players/${teamId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getPlayersFromOneTeamResponse.body.players).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: PLAYER_REPOSITORY.PLAYER_NAME,
          known_as: PLAYER_REPOSITORY.PLAYER_KNOWN_AS,
          nationality: PLAYER_REPOSITORY.PLAYER_NATIONALITY,
          position: PLAYER_REPOSITORY.PLAYER_POSITION,
          overall: PLAYER_REPOSITORY.PLAYER_OVERALL,
          team_id: teamId,
        }),
      ]),
    )
  })
})
