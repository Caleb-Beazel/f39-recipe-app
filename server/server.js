require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {SERVER_PORT} = process.env
const path = require('path')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(process.cwd() + "/client")))

const { buildTables, addRecipe, getRecipes } = require('./controller')

// USED TO DELETE AND RECREATE TABLES
// app.post('/build-tables', buildTables)

app.get('/recipes', getRecipes)
app.post('/recipes', addRecipe)



app.listen(SERVER_PORT, () => console.log(`Docked at ${SERVER_PORT}`))