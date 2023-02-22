/* eslint-disable camelcase */
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
  USER_REPOSITORY,
  TEAM_REPOSITORY,
  PLAYER_REPOSITORY,
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
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
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
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
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
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
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

  it('Should be able to list a player', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
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

    const createdPlayerResponse = await request(app.server)
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

    const playerId = createdPlayerResponse.body.createdPlayer.id

    const getPlayerResponse = await request(app.server)
      .get(`/users/teams/players/one/${playerId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getPlayerResponse.body.player).toEqual(
      expect.objectContaining({
        name: PLAYER_REPOSITORY.PLAYER_NAME,
        known_as: PLAYER_REPOSITORY.PLAYER_KNOWN_AS,
        nationality: PLAYER_REPOSITORY.PLAYER_NATIONALITY,
        position: PLAYER_REPOSITORY.PLAYER_POSITION,
        overall: PLAYER_REPOSITORY.PLAYER_OVERALL,
        team_id: teamId,
      }),
    )
  })

  it('Should be able to delete a player by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
      })

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

    const createdPlayerResponse = await request(app.server)
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

    const playerId = createdPlayerResponse.body.createdPlayer.id

    const deletePlayerResponse = await request(app.server)
      .delete(`/users/teams/players/${playerId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(deletePlayerResponse.statusCode).toBe(200)
  })

  it('Should be able to update a player by id if cookie is present', async () => {
    const createUserResponse = await request(app.server)
      .post('/users/create')
      .send({
        email: USER_REPOSITORY.USER_EMAIL,
        password: USER_REPOSITORY.USER_PASSWORD,
      })

    const cookies = createUserResponse.get('Set-Cookie')
    const userId = createUserResponse.body.id

    const createTeamResponse = await request(app.server)
      .post(`/users/teams/create/${userId}`)
      .set('Cookie', cookies)
      .send({
        title: TEAM_REPOSITORY.TEAM_TITLE,
        owner: TEAM_REPOSITORY.TEAM_OWNER,
        badge_url: TEAM_REPOSITORY.TEAM_BADGE_URL,
      })
      .expect(201)

    const teamId = createTeamResponse.body.id

    const createdPlayerResponse = await request(app.server)
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

    const playerId = createdPlayerResponse.body.createdPlayer.id

    await request(app.server)
      .put(`/users/teams/players/${playerId}`)
      .set('Cookie', cookies)
      .send({
        name: PLAYER_REPOSITORY.UPDATED_PLAYER_NAME,
        known_as: PLAYER_REPOSITORY.UPDATED_PLAYER_KNOWN_AS,
        nationality: PLAYER_REPOSITORY.UPDATED_PLAYER_NATIONALITY,
        position: PLAYER_REPOSITORY.UPDATED_PLAYER_POSITION,
        overall: PLAYER_REPOSITORY.UPDATED_PLAYER_OVERALL,
        team_id: teamId,
      })
      .expect(200)

    const getPlayerResponse = await request(app.server)
      .get(`/users/teams/players/one/${playerId}`)
      .set('Cookie', cookies)
      .expect(200)

    const { name, known_as, nationality, position, overall, team_id } =
      getPlayerResponse.body.player

    expect(name).toBe(PLAYER_REPOSITORY.UPDATED_PLAYER_NAME)
    expect(known_as).toBe(PLAYER_REPOSITORY.UPDATED_PLAYER_KNOWN_AS)
    expect(nationality).toBe(PLAYER_REPOSITORY.UPDATED_PLAYER_NATIONALITY)
    expect(position).toBe(PLAYER_REPOSITORY.UPDATED_PLAYER_POSITION)
    expect(overall).toBe(PLAYER_REPOSITORY.UPDATED_PLAYER_OVERALL)
    expect(team_id).toBe(teamId)
  })
})
