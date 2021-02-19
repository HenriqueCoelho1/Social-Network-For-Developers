const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config() //.env para o ENV.PROCESS
const secret = process.env.JWT_SECRET
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')
//@route    GET api/auth
//@desc     TEST route
//@access   Public

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)

    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')

    }
})

//@route    POST api/auth
//@desc     Authenticate User
//@access   Public
router.post('/', [
    check('email', 'Invalid email or password').isEmail(),
    check('password', 'Invalid email or password').exists(),
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        //See if user exists
        let user = await User.findOne({ email: email })
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid credentials' }] })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid credentials' }] })
        }


        //Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,

            }
        }

        jwt.sign(payload, secret,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err
                res.json({ token })
            })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')

    }



})

module.exports = router
