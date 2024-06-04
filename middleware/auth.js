const jwt = require('jsonwebtoken')

const { AUTH_SECRET_KEY } = require('../config')
const { Users, Settings } = require('../models')

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')

  if (!token) return res.status(401).json({ success: false, message: 'Access Denied' })
  try {
    const decoded = jwt.verify(token, AUTH_SECRET_KEY)
    const user = await Users.findOne({
      where: { id: decoded.id },
      attributes: ['username', 'first_name', 'last_name'],
    })

    const settings = await Settings.findAll({
      where: {
        key: [
          'APPOINTMENT_SLOT_DURATION',
          'OPERATIONAL_HOURS',
          'MAXIMUM_SLOTS_PER_APPOINTMENT',
          'UNAVAILABLE_HOURS',
          'DAYS_OFF',
        ],
      },
      attributes: ['key', 'value'],
    })

    // attach settings to the req.locals for later usage
    const settingsMap = settings.reduce((acc, curr) => {
      if (['DAYS_OFF', 'UNAVAILABLE_HOURS'].includes(curr.key)) {
        acc[curr.key] = JSON.parse(curr.value)
      } else {
        acc[curr.key] = curr.value
      }
      return acc
    }, {})

    res.locals.user = user
    res.locals.settings = settingsMap
    next()
  } catch (error) {
    console.log('error: ', error)
    return res.status(401).json({
      success: false,
      message: 'Invalid token provided',
    })
  }
}

module.exports =  verifyToken
