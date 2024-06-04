import Users from './users'
import UserAppointments from './userAppointments'
import Appointments from './appointments'
import Settings from './settings'
import db from './db'

Users.belongsToMany(Appointments, { through: UserAppointments, foreignKey: 'user_id' })
Appointments.belongsToMany(Users, { through: UserAppointments, foreignKey: 'appointment_id' })

export {
  Users,
  UserAppointments,
  Appointments,
  db,
  Settings,
}
