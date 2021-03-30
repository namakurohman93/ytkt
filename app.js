const express = require("express")
const path = require("path")
const app = express()

require("./models/init")

if (process.env.NODE_ENV == "development") {
  require("dotenv").config()
  app.use(require("cors")())
}

app.set("x-powered-by", false)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))
app.use("/api", require("./routes/api"))

function defaultHandler(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"))
}

app.get("/", defaultHandler)
app.get("*", defaultHandler)

module.exports = app
