import { knex } from '../database'

interface IUserSession {
  id: string
  sessionId: string
}

export async function getSessionById(
  sessionId: string | undefined,
): Promise<IUserSession | null> {
  const userSession = await knex('users').where('session_id', sessionId).first()

  if (!userSession?.id || !userSession?.session_id) {
    return null
  }

  return {
    id: userSession.id,
    sessionId: userSession.session_id,
  }
}
