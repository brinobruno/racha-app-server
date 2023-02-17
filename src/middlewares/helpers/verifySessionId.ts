import { HttpError } from '../../errors/customException'

export function verifySessionId(sessionId: string | undefined) {
  if (!sessionId) {
    throw new HttpError(401, 'Unauthorized: No session ID present')
  }
}
