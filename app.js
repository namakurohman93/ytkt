const express = require('express')
const app = express()

const job = require('./helpers/cron-job')
job.start()

app.get('/', function(req, res) {
  res.send({ message: "Hello World!" })
})

module.exports = app
