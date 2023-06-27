import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'

export const SECRET_KEY: Secret = 'your-secret-key-here'

export interface CustomRequest extends FastifyRequest {
  token: string | JwtPayload
}

export const auth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw new Error()
    }

    const decoded = jwt.verify(token, SECRET_KEY)
    ;(request as CustomRequest).token = decoded
  } catch (error) {
    reply.status(401).send('Please authenticate')
  }
}
