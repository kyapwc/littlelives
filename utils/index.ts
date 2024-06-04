import dayjs from './dayjs'
import {
  OPERATIONAL_HOURS as envOperationalHours,
  APPOINTMENT_SLOT_DURATION as envApptSlotDuration,
} from '../config'

export type AppointmentObj = {
  date: string;
  time: string;
  available_slots: number;
}

export type SettingsMap = {
  APPOINTMENT_SLOT_DURATION: any,
  OPERATIONAL_HOURS: any,
  MAXIMUM_SLOTS_PER_APPOINTMENT: any,
  UNAVAILABLE_HOURS: any,
  DAYS_OFF: any,
}

/**
 * Check if new appointment clashes with existing appointment.
 *
 * This is just a auxiliary method to be used in a recursive method
 */
const isConflict = (
  existingAppointment: AppointmentObj,
  newAppointment: AppointmentObj,
  setting: number,
): boolean => {
  const existingDateTime = dayjs(`${existingAppointment.date} ${existingAppointment.time}`)
  const newDateTime = dayjs(`${newAppointment.date} ${newAppointment.time}`)

  return (
    existingDateTime.isBefore(newDateTime.add(setting || Number(envApptSlotDuration), 'minutes')) &&
      newDateTime.isBefore(existingDateTime.add(setting || Number(envApptSlotDuration), 'minutes'))
  )
}

/**
 * Recursive function to iterate through the original appointments array and calls `isConflict`.
 *
 * @see `isConflict`
 */
const validateAppointment = (
  newAppointment: AppointmentObj,
  index: number = 0,
  appointments: Array<AppointmentObj>,
  setting: number,
): boolean => {
  if (index === appointments.length) {
    appointments.push(newAppointment)
    return true;
  }

  const existingAppointment = appointments[index];
  if (isConflict(existingAppointment, newAppointment, setting)) {
    return false;
  }

  return validateAppointment(newAppointment, index + 1, appointments, setting);
}

/**
 * Method to generate a list of appointments for a given date
 *
 * @param {string} date
 * @param {number} availableSlots
 * @returns {AppointmentObj}
 */
const generateAppointments = async (
  date: string,
  availableSlots: number,
  settingsMap: SettingsMap,
): Promise<AppointmentObj[]> => {
  const operationalHoursSplit = (settingsMap?.OPERATIONAL_HOURS || envOperationalHours).split('-')

  const start = operationalHoursSplit[0]
  const end = operationalHoursSplit[1]
  const unavailableHoursJSON = settingsMap?.UNAVAILABLE_HOURS ?
    settingsMap?.UNAVAILABLE_HOURS :
    []

  const unavailableHours: Array<{ start: string; end: string; }> = unavailableHoursJSON.map((time: string) => {
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

  const appointments: Array<AppointmentObj> = []
  let currentTime = startTime

  while (currentTime.isBefore(endTime)) {
    const isUnavailable = unavailableHours.some(({ start, end }) => {
      const [startHour, startMinute] = start.split(':');
      const [endHour, endMinute] = end.split(':');
      const unavailableStartTime = dayjs(date).set('hour', Number(startHour)).set('minute', Number(startMinute));
      const unavailableEndTime = dayjs(date).set('hour', Number(endHour)).set('minute', Number(endMinute));
      return currentTime.isBetween(unavailableStartTime, unavailableEndTime, 'hour', '[]');
    });

    if (!isUnavailable) {
      const appointmentData: AppointmentObj = {
        date: currentTime.format('YYYY-MM-DD'),
        time: currentTime.format('HH:mm'),
        available_slots: availableSlots,
      }
      appointments.push(appointmentData)
    }

    currentTime = currentTime.add(settingsMap?.APPOINTMENT_SLOT_DURATION || envApptSlotDuration, 'minutes')
  }

  return appointments
}

export {
  generateAppointments,
  validateAppointment,
}
