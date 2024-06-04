// APPOINTMENT_SLOT_DURATION=5
// OPERATIONAL_HOURS='09:00-18:00'
// MAXIMUM_SLOTS_PER_APPOINTMENT=5
// DAYS_OFF=[date, date, date]
// UNAVAILABLE_HOURS=[11:00-12:00, 13:00-15:00]
const { v4: uuidv4 } = require('uuid')

const settings = [
  {
    key: 'APPOINTMENT_SLOT_DURATION',
    value: '5',
  },
  {
    key: 'OPERATIONAL_HOURS',
    value: '09:00-18:00',
  },
  {
    key: 'MAXIMUM_SLOTS_PER_APPOINTMENT',
    value: '5',
  },
  {
    key: 'UNAVAILABLE_HOURS',
    value: JSON.stringify([]),
  },
  {
    key: 'DAYS_OFF',
    value: JSON.stringify([]),
  },
]

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    const data = settings.map((setting) => ({
      id: uuidv4(),
      ...setting,
      created_at: new Date(),
      updated_at: new Date(),
    }))

    return queryInterface.bulkInsert('Settings', data, { transaction })
  }),

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.bulkDelete('Settings', null, { transaction })
  }),
}
