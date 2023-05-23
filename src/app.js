const express = require('express')
const userRouter = require('./routers/user')
require('./db/mongoose')

//define express to app
const app = express()

app.use(express.json())
app.use(userRouter)

module.exports = app