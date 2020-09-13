const path = require("path")
const router = require("express").Router()
const apiRouter = require("./api")

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public"))
})
router.use("/api", apiRouter)

module.exports = router
