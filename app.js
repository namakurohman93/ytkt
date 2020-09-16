/* const job = require('./helpers/cron-job') */
const path = require("path")
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
app.use("/api", require("./routes/api"))


function defaultHandler(req, res) {
  res.sendFile(path.join(__dirname), "public", "index.html")
}

app.get("/", defaultHandler)
app.get("/*", defaultHandler)

module.exports = app
