import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT_NUMBER,
  })
  .then(() => {
    console.log(`HTTP Server Running on port: ${env.PORT_NUMBER}`)
  })
