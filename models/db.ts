import { Sequelize } from 'sequelize'

import { DATABASE_URL } from '../config'

if (!DATABASE_URL?.length) throw new Error('Unable to connect to database, please input DATABASE_URL in .env file')

const db = new Sequelize(DATABASE_URL)

export default db
