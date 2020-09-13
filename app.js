/* const job = require('./helpers/cron-job') */
const express = require("express")
const app = express()

/* job.start() */

app.locals.credentials = { email: "", password: "" }

app.locals.session = {
  gameworldName: "",
  msid: "",
  cookies: "",
  lobbySession: "",
  gameworldSession: ""
}

if (process.env.NODE_ENV == "development") app.use(require("cors")())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))
app.use("/", require("./routes"))

module.exports = app
