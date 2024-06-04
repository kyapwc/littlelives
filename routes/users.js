const router = require('express').Router()
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { Users } = require('../models')
const { AUTH_SECRET_KEY } = require('../config')

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, password, username } = req.body

    if (!first_name?.length || !last_name?.length || !password?.length || !username?.length) {
      return res.status(500).json({
        success: false,
        message: 'Invalid data provided, required: first_name, last_name, password & username',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await Users.findOne({
      where: {
        username: { [Op.like]: username },
      }
    })

    if (existingUser) {
      return res.status(500).json({
        success: false,
        message: 'Invalid username',
      })
    }

    await Users.create({
      username,
      password: hashedPassword,
      first_name,
      last_name,
    })

    return res.json({
      success: true,
      message: 'Successfully registered',
    })
  } catch (error) {
    console.log('error: ', error)
    return res.status(500).json({
      success: false,
      message: `Failed to register new user, ${error.message}`,
    })
  }
})


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ id: user.id }, AUTH_SECRET_KEY, {
      expiresIn: '1h',
    });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Login failed, ${error.message}` });
  }
});

module.exports = router
