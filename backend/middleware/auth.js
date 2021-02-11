const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.JWT_SECRET

module.exports = function (req, res, next) {
    //GET token from the head

    const token = req.header('x-auth-token')

    //check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    //Verify if has a token
    try {
        const decoded = jwt.verify(token, secret)

        req.user = decoded.user
        next()

    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' })

    }
}