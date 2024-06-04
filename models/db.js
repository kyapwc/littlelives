const { Sequelize } = require('sequelize')

const { DATABASE_URL } = require('../config')

if (!DATABASE_URL?.length) throw new Error('Unable to connect to database, please input DATABASE_URL in .env file')

const db = new Sequelize(DATABASE_URL)

module.exports = db
