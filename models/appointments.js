const { Sequelize, DataTypes } = require('sequelize')
const dayjs = require('../utils/dayjs')

const db = require('./db')

const Appointment = db.define('Appointments',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: dayjs().format('YYYY-MM-DD'),
    },
    available_slots: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '09:00',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  { underscored: true, tableName: 'Appointments' },
)

module.exports = Appointment
