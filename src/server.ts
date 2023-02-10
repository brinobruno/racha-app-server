import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT_NUMBER,
  })
  .then(() => {
    env.NODE_ENV === 'development'
      ? console.log(`HTTP Server Running on port: ${env.PORT_NUMBER}`)
      : console.log('HTTP Server Running!')
  })
