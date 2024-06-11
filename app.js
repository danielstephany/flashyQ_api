const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const getUserFromToken = require("./middleware/getUserFromToken.js")

require('dotenv').config()

const authRoutes = require("./routes/auth.js")
const userRoutes = require("./routes/user.js")

const port = "8080"

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(getUserFromToken)

app.use("/auth", authRoutes)
app.use("/user", userRoutes)

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({message: error.message})
})

mongoose.connect(process.env.DB_URL)
.then((a) => {
    app.listen(port, () => {
        console.log("listing on port:" + port);
    })
}).catch(e => {
    console.log(e)
})