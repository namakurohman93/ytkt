const router = require("express").Router()
const ApiController = require("../controllers/api-controller")

router.get("/status", ApiController.getStatus)
router.post("/login", ApiController.loginHandler)
router.get("/players", ApiController.getAllPlayers)
router.get("/players/:playerId", ApiController.getPlayer)
router.get("/inactive", ApiController.getInactive)
router.get("/animals", ApiController.findAnimals)

module.exports = router
