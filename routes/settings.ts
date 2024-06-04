import expressRouter from 'express'
import { Settings } from '../models'

import verifyToken from '../middleware/auth'

const router = expressRouter.Router()

router.put('/:key', verifyToken, async (req, res) => {
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

router.get('/', verifyToken, async (_, res) => {
  const settings = await Settings.findAll()

  return res.json({
    success: true,
    message: 'Successfully retrieved settings',
    settings,
  })
})

export default router
