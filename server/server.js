require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {SERVER_PORT} = process.env

const app = express()

app.use(express.json())
app.use(cors())

const { addRecipe, buildTables } = require('./controller')

//app.post('/build-tables', buildTables)

app.post('/api/recipes', addRecipe)



app.listen(SERVER_PORT, () => console.log(`Docked at ${SERVER_PORT}`))