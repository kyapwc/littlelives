const router = require('express').Router()
const { Settings } = require('../models')

router.put('/:key', async (req, res) => {
  const { key, value } = req.body

  if (!key?.length || !value?.length) {
    return res.json({
      success: false,
      message: 'Invalid key and value pair',
    })
  }

  const setting = await Settings.findOne({
    where: { key },
  })

  if (!setting) {
    return res.json({
      success: false,
      message: 'Setting not found',
    })
  }

  await setting.update({ value })

  return res.json({
    success: true,
    message: 'Successfully update settings',
    setting,
  })
})

router.get('/', async (_, res) => {
  const settings = await Settings.findAll()

  return res.json({
    success: true,
    message: 'Successfully retrieved settings',
    settings,
  })
})

module.exports = router
