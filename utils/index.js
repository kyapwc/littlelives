const dayjs = require('./dayjs')
const { Settings } = require('../models')
const {
  OPERATIONAL_HOURS: envOperationalHours,
  APPOINTMENT_SLOT_DURATION: envApptSlotDuration,
} = require('../config')

/**
 * @typedef AppointmentObj
 * @property {string} date
 * @property {string} time
 * @property {number} available_slots
 */

/**
 * Check if new appointment clashes with existing appointment.
 *
 * This is just a auxiliary method to be used in a recursive method
 *
 * @param {AppointmentObj} existingAppointment
 * @param {AppointmentObj} newAppointment
 * @param {object} setting
 * @returns {boolean}
 */
const isConflict = (existingAppointment, newAppointment, setting) => {
  const existingDateTime = dayjs(`${existingAppointment.date} ${existingAppointment.time}`)
  const newDateTime = dayjs(`${newAppointment.date} ${newAppointment.time}`)

  return (
    existingDateTime.isBefore(newDateTime.add(setting || envApptSlotDuration, 'minutes')) &&
      newDateTime.isBefore(existingDateTime.add(setting || envApptSlotDuration, 'minutes'))
  )
}

/**
 * Recursive function to iterate through the original appointments array and calls `isConflict`.
 *
 * @param {AppointmentObj} newAppointment
 * @param {number} index
 * @param {Array<AppointmentObj>} appointments
 * @returns {boolean}
 *
 * @see `isConflict`
 */
module.exports.validateAppointment = (newAppointment, index = 0, appointments, setting) => {
  if (index === appointments.length) {
    appointments.push(newAppointment)
    return true;
  }

  const existingAppointment = appointments[index];
  if (isConflict(existingAppointment, newAppointment, setting)) {
    return false;
  }

  return this.validateAppointment(newAppointment, index + 1, appointments, setting);
}

/**
 * Method to generate a list of appointments for a given date
 *
 * @param {string} date
 * @param {number} availableSlots
 * @returns {AppointmentObj}
 */
module.exports.generateAppointments = async (date, availableSlots) => {
  const settings = await Settings.findAll({
    where: {
      key: [
        'OPERATIONAL_HOURS',
        'APPOINTMENT_SLOT_DURATION',
        'UNAVAILABLE_HOURS',
      ],
    },
    attributes: ['key', 'value'],
  })
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {})

  const operationalHoursSplit = (settingsMap?.OPERATIONAL_HOURS || envOperationalHours).split('-')

  const start = operationalHoursSplit[0]
  const end = operationalHoursSplit[1]
  const unavailableHoursJSON = settingsMap?.UNAVAILABLE_HOURS ?
    JSON.parse(settingsMap?.UNAVAILABLE_HOURS) :
    []

  const unavailableHours = unavailableHoursJSON.map((time) => {
    const splitTime = time.split('-')

    return {
      start: splitTime[0],
      end: splitTime[1]
    }
  })

  const [startHour, startMinute] = start.split(':')
  const [endHour, endMinute] = end.split(':')

  const startTime = dayjs(date).set('hour', startHour).set('minute', startMinute)
  const endTime = dayjs(date).set('hour', endHour).set('minute', endMinute)

  const appointments = []
  let currentTime = startTime

  while (currentTime.isBefore(endTime)) {
    const isUnavailable = unavailableHours.some(({ start, end }) => {
      const [startHour, startMinute] = start.split(':');
      const [endHour, endMinute] = end.split(':');
      const unavailableStartTime = dayjs(date).set('hour', startHour).set('minute', startMinute);
      const unavailableEndTime = dayjs(date).set('hour', endHour).set('minute', endMinute);
      return currentTime.isBetween(unavailableStartTime, unavailableEndTime, 'hour', '[]');
    });

    if (!isUnavailable) {
      const appointmentData = {
        date: currentTime.format('YYYY-MM-DD'),
        time: currentTime.format('HH:mm'),
        available_slots: availableSlots,
      }
      appointments.push(appointmentData)
    }

    currentTime = currentTime.add(settingsMap?.APPOINTMENT_SLOT_DURATION || envApptSlotDuration, 'minutes')
  }
  console.log('appointments: ', appointments)

  return appointments
}
