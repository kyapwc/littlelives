require('dotenv').config()
import express from 'express'
import bodyParser from 'body-parser'

import appointments from './routes/appointment'
import settings from './routes/settings'
import users from './routes/users'
import { db } from './models'

const app: express.Express = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.use('/appointments', appointments)
app.use('/settings', settings)
app.use('/users', users)

const server = app.listen(port, async () => {
  try {
    await db.authenticate()
  } catch (error) {
    console.log('Error: Unable to connect to database', error)
  }
  console.log(`App is listening on port ${port}`)
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received, closing HTTP server')

  server.close()
})

