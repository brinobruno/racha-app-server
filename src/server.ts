import 'dotenv/config'
import fastify from 'fastify'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(usersRoutes)

const PORT_NUMBER: number =
  parseInt(<string>process.env.PORT_NUMBER, 10) || 3333

app
  .listen({
    port: PORT_NUMBER,
  })
  .then(() => {
    console.log(`HTTP Server Running on port: ${PORT_NUMBER}`)
  })
