require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const appointments = require('./routes/appointment')
const settings = require('./routes/settings')
const users = require('./routes/users')
const { db } = require('./models')

const app = express()
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

