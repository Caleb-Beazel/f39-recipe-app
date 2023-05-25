const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

const { } = require('./controller')




app.listen(7766, () => console.log(`Docked at ${SERVER_PORT}`))