const router = require("express").Router()

const ApiController = require("../controllers/api-controller")

router.get("/status", ApiController.getStatus)
router.post("/login", ApiController.loginHandler)

module.exports = router
