const User = require("../models/user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require("../utils/sercrets.js")

const signup = async (req, res, next) => {
    const {firstName, lastName, email, password, password2} = req.body

    try {
        if(password !== password2){
            const error = new Error("passwords do not match")
            error.statusCode = 422
            throw error
        }

        if (firstName && lastName && email && password){
            const salt = bcrypt.genSaltSync(10)
            const passwordHash = bcrypt.hashSync(password, salt)
            await User.create({ firstName, lastName, email, password: passwordHash })
            const user = await User.findOne({ email })
            const token = jwt.sign({ userId: user._id }, jwtSecret)

            res.status(200).json({ user, token})
        } else {
            const error = new Error("All field are required")
            error.statusCode = 422
            throw error
        }

    } catch(e){
        if (!e.statusCode) e.statusCode = 500;
        next(e)
    }
}

const login = async (req, res, next) => {
    const {email, password} = req.body

    try {
        if(email && password){
            const userWithPass = await User.findOne({email}, "password").select("+password")
            if (!userWithPass || !bcrypt.compareSync(password, userWithPass.password)){
                const error = new Error("wrong password")
                error.statusCode = 422;
                throw error
            }
            const userWithoutPass = await User.findOne({email})
            const token = jwt.sign({ userId: userWithoutPass._id }, jwtSecret)

            res.status(200).json({user: userWithoutPass, token})

        } else {
            const error = new Error("email and password are required")
            error.statusCode = 422;
            throw error
        }

    } catch(e){
        if (!e.statusCode) e.statusCode = 500;
        next(e)
    }

}

module.exports = {
    signup,
    login
}