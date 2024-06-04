import expressRouter from 'express'
import { Op } from 'sequelize'
import * as uuid from 'uuid'

import { Appointments, UserAppointments, db } from '../models'
import dayjs from '../utils/dayjs'
import { validateAppointment, generateAppointments, AppointmentObj } from '../utils'
import verifyToken from '../middleware/auth'

const router = expressRouter.Router()

router.post('/generate', verifyToken, async (req, res) => {
  const transaction = await db.transaction()
  try {
    const { body } = req

    const validDate = body?.date?.length > 0 && dayjs(body.date).isValid()

    if (!validDate) {
      return res.status(500).json({ success: false, message: 'Invalid date provided' })
    }

    const validSlots = body?.available_slots?.length > 0 && !Number.isNaN(body?.available_slots)
    const availableSlots = validSlots ? Number(body?.available_slots) : 0

    const settingsMap = res.locals.settings

    if (settingsMap?.MAXIMUM_SLOTS_PER_APPOINTMENT && availableSlots > Number(settingsMap?.MAXIMUM_SLOTS_PER_APPOINTMENT)) {
      return res.status(500).json({
        success: false,
        message: 'Provided max slots is too much compared to settings',
      })
    }

    const providedDate = dayjs(body.date)
    const providedDateDay = providedDate.day()
    const formattedDate = providedDate.format('YYYY-MM-DD')

    if (settingsMap?.DAYS_OFF && settingsMap?.DAYS_OFF.includes(formattedDate)) {
      return res.status(500).json({
        success: false,
        message: 'Date is on day off and will not be able to operate.'
      })
    }

    if ([6, 7].includes(providedDateDay)) {
      return res.status(500).json({
        success: false,
        message: 'Provided date is on a weekend and is not available.',
      })
    }

    const appointmentsOnSpecifiedDate = await Appointments.findAll({
      where: { date: formattedDate },
      attributes: ['id'],
      transaction,
    })

    if (appointmentsOnSpecifiedDate?.length > 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create appointments because date already has appointments generated',
      })
    }

    const newAppointments = await generateAppointments(
      dayjs(body.date).format('YYYY-MM-DD'),
      availableSlots,
      settingsMap,
    )

    const appointments = await Appointments.bulkCreate(newAppointments, { transaction })

    await transaction.commit()

    return res.json({
      success: true,
      message: 'Successfully created appointments',
      appointments,
    })
  } catch (error) {
    await transaction.rollback()
    return res.status(500).json({
      success: true,
      message: `Failed to generate appointments for given date: ${(error as any).message}`,
    })
  }
})

// should only allow admin to access this route
router.post('/', verifyToken, async (req, res) => {
  const transaction = await db.transaction()
  try {
    const data = req.body

    // verify date and time
    const validDate = data?.date?.length > 0 && dayjs(data.date).isValid()

    if (!validDate) {
      return res.status(500).json({ success: false, message: 'Invalid date provided' })
    }

    const validTime = data?.time?.length > 0 && dayjs(`${data.date} ${data.time}`).isValid()
    if (!validTime) {
      return res.status(500).json({ success: false, message: 'Invalid time provided' })
    }

    const validSlots = data?.available_slots?.length > 0 && !Number.isNaN(data?.available_slots)
    const available_slots = validSlots ? Number(data?.available_slots) : 0

    const settingsMap = res.locals.settings

    if (
      settingsMap?.MAXIMUM_SLOTS_PER_APPOINTMENT &&
        available_slots > Number(settingsMap.MAXIMUM_SLOTS_PER_APPOINTMENT)
    ) {
      return res.status(500).json({
        success: false,
        message: 'Provided max slots is too much compared to settings',
      })
    }

    const providedDate = dayjs(data.date)
    const providedDateDay = providedDate.day()
    const formattedDate = providedDate.format('YYYY-MM-DD')

    if (settingsMap?.DAYS_OFF && settingsMap?.DAYS_OFF.includes(formattedDate)) {
      return res.status(500).json({
        success: false,
        message: 'Date is on day off and will not be able to operate.'
      })
    }

    if ([6, 7].includes(providedDateDay)) {
      return res.status(500).json({
        success: false,
        message: 'Provided date is on a weekend and is not available.',
      })
    }

    const date = providedDate.format('YYYY-MM-DD')

    const appointments = await Appointments.findAll({
      where: { date },
      raw: true,
      transaction,
    }) as unknown as Array<AppointmentObj>

    const appointmentData = {
      date,
      time: data.time,
      available_slots,
    }

    const valid = validateAppointment(
      appointmentData,
      0,
      appointments,
      settingsMap?.APPOINTMENT_SLOT_DURATION,
    )

    if (!valid) {
      return res.status(500).json({
        success: false,
        message: 'Apppointment clashes with other currently available appointments with 30 minutes interval',
      })
    }

    const appointment = await Appointments.create(appointmentData, { transaction })
    await transaction.commit()

    return res.json({
      success: true,
      message: 'Successfully created appointment',
      appointment,
    })
  } catch (error) {
    await transaction.rollback()
    return res.status(500).json({
      success: true,
      message: `Failed to generate appointment for provided data: ${(error as any).message}`,
    })
  }
})

router.get('/', verifyToken, async (req, res) => {
  try {
    const { query } = req

    const date = query?.date?.length ? String(query?.date) : undefined

    if (!date || !dayjs(date).isValid()) {
      return res.status(500).json({ success: false, message: 'Invalid date provided' })
    }

    const appointments = await Appointments.findAll({
      where: {
        date: dayjs(date).format('YYYY-MM-DD'),
      },
    })

    return res.json({
      success: true,
      message: 'Successfully retrieved appointments',
      appointments,
    })
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: `Failed to get appointments for specified date: ${(error as any).message}`,
    })
  }
})

router.post('/book', verifyToken, async (req, res) => {
  const transaction = await db.transaction()
  try {
    const { body } = req
    const { user } = res.locals

    if (!body?.appointment_id && !String(body.appointment_id)?.length) {
      return res.status(500).json({
        success: false,
        message: 'appointment_id should be provided',
      })
    }

    if (!uuid.validate(body.appointment_id)) {
      return res.status(500).json({
        success: false,
        message: 'Invalid appointment_id provided (should be a valid uuid)',
      })
    }

    const userHasAppointment = await UserAppointments.findOne({
      where: { user_id: user.id },
      transaction,
    })

    if (userHasAppointment) {
      return res.status(500).json({
        success: false,
        message: 'User already has appointment and cannot schedule another one',
      })
    }

    // when booking, we need the userId & appointmentId
    // verification should be done to see if appointment.available_slots > 0
    const appointment = await Appointments.findOne({
      where: {
        id: body.appointment_id,
        available_slots: { [Op.gt]: 0 },
      },
      transaction,
    })

    if (!appointment) {
      return res.status(500).json({
        success: false,
        message: 'Failed to book appointment due to insufficient slots / appointment does not exist',
      })
    }

    await appointment.decrement('available_slots', { by: 1, transaction })
    await UserAppointments.create({
      appointment_id: appointment.id,
      user_id: user.id,
    }, { transaction })

    await transaction.commit()
    return res.json({
      success: true,
      message: `Successfully booked appointment`,
      appointment,
    })
  } catch (error) {
    await transaction.rollback()
    return res.status(500).json({
      success: false,
      message: `Failed to book appointment due to error: ${(error as any).message}`,
    })
  }
})

router.delete('/:id', verifyToken, async (req, res) => {
  const transaction = await db.transaction()
  try {
    const { id } = req.params

    const appointment = await Appointments.findOne({
      where: { id },
      transaction,
    })

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      })
    }

    const userAppointment = await UserAppointments.findOne({
      where: { appointment_id: id, user_id: res.locals.user.id },
      transaction,
    })

    if (!userAppointment) {
      return res.status(401).json({
        success: false,
        message: 'User does not have the appointment scheduled',
      })
    }

    await appointment.increment('available_slots', { by: 1, transaction })
    await userAppointment.destroy({ transaction })
    await transaction.commit()

    return res.json({
      success: true,
      message: 'Successfully cancelled appointment'
    })
  } catch (error) {
    await transaction.rollback()
    return res.status(500).json({
      success: false,
      message: `Failed to cancel appointment due to error: ${(error as any).message}`,
    })
  }
})

export default router
