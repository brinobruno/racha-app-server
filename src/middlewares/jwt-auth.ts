import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'

import { env } from '../env'

export const SECRET_KEY: Secret = env.JWT_SECRET_KEY

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
    if (error instanceof jwt.JsonWebTokenError) {
      reply.status(401).send('Invalid Token')
    } else {
      reply.status(401).send('Please authenticate')
    }
  }
}
