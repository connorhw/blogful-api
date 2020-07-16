require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const ArticlesService = require('./articles-service')

const app = express()

//const morganOption = (process.env.NODE_ENV === 'production')
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/articles', (req, res, next) => {
  //res.send('All articles')
  //ArticlesService.getAllArticles(/* need knex instance here */)
  const knexInstance = req.app.get('db')
  ArticlesService.getAllArticles(knexInstance)
    .then(articles => {
      res.json(articles)
    })
    .catch(next) //errors get handled by our error-handler middleware, below
})
app.get('/articles/:article_id', (req, res, next) => {
  //res.json({ 'requested_id': req.params.article_id, this: 'should fail' })
  const knexInstance = req.app.get('db')
  ArticlesService.getById(knexInstance, req.params.article_id)
    .then(article => {
      res.json(article)
    })
    .catch(next)
})

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