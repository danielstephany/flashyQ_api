const jwt = require('jsonwebtoken')
const User = require("../models/user.js")
const { jwtSecret } = require("../utils/sercrets.js")

module.exports = async (req, res, next) => {
    const tokenHeader = req.get("authorization")
    if (tokenHeader) {
        try {
            let token = tokenHeader.split(" ")[1]
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    const error = new Error("could not verify token")
                    error.statusCode(401)
                    throw error
                }

                User.findById(decoded.userId)
                    .then(user => {
                        req.user = user
                        next()
                    }).catch(e => {
                        const error = new Error("could not get user from token")
                        error.statusCode(422)
                        throw error
                    })
            })
        } catch (e) {
            if (!e.statusCode) e.statusCode = 500
            next(error)
        }
    } else {
        next()
    }
}