/* eslint-disable camelcase */
import { z } from 'zod'

import { createPlayerBodySchema } from './players.schemas'
import { playerRepository } from './players.repository'

export async function createPlayer(
  input: z.infer<typeof createPlayerBodySchema>,
  teamId: string | undefined,
) {
  const playerToCreate = await playerRepository.createPlayerById(input, teamId)

  return playerToCreate
}
