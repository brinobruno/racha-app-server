import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    env.NODE_ENV === 'development'
      ? console.log(`HTTP Server Running on port: ${env.PORT}`)
      : console.log('HTTP Server Running!')
  })
