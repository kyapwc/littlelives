const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
const APPOINTMENT_SLOT_DURATION = process.env.APPOINTMENT_SLOT_DURATION || 30
const OPERATIONAL_HOURS = (process.env.OPERATIONAL_HOURS || '09:00-18:00').split('-')
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || 'yapweichun'

module.exports = {
  PORT,
  DATABASE_URL,
  APPOINTMENT_SLOT_DURATION,
  OPERATIONAL_HOURS,
  AUTH_SECRET_KEY,
}
