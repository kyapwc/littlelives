const Users = require('./users')
const UserAppointments = require('./userAppointments')
const Appointments = require('./appointments')
const Settings = require('./settings')
const db = require('./db')

Users.belongsToMany(Appointments, { through: UserAppointments, foreignKey: 'user_id' })
Appointments.belongsToMany(Users, { through: UserAppointments, foreignKey: 'appointment_id' })

module.exports = {
  Users,
  UserAppointments,
  Appointments,
  db,
  Settings,
}
