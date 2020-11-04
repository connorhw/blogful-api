require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { json } = require('express')
const articlesRouter = require('./articles/articles-router')

const app = express()

//const morganOption = (process.env.NODE_ENV === 'production')
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/articles', articlesRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

//Error Handler Middleware
app.use(function errorHandler(error, req, res, next) {
   let response
   //if (process.env.NODE_ENV === 'production') {
   if (NODE_ENV === 'production') {
     response = { error: { message: 'server error' } }
   } else {
     console.error(error)
     response = { message: error.message, error }
   }
   res.status(500).json(response)
 })

module.exports = app