const router = require("express").Router()
const ApiController = require("../controllers/api-controller")

router.get("/status", ApiController.getStatus)
router.post("/login", ApiController.loginHandler)
router.get("/players", ApiController.searchPlayer)
router.get("/players/:playerId", ApiController.getPlayerDetail)
router.get("/inactive", ApiController.getInactive)
router.get("/animals", ApiController.findAnimals)

module.exports = router
