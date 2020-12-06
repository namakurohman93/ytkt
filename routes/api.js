const router = require("express").Router()
const ApiController = require("../controllers/api-controller")

router.get("/status", ApiController.getStatus)
router.post("/login", ApiController.loginHandler)
router.get("/players", ApiController.searchPlayer)
router.get("/players/:playerId", ApiController.getPlayerDetail)
router.get("/kingdoms", ApiController.searchKingdom)
router.get("/kingdoms/:kingdomId", ApiController.getKingdomDetail)
router.get("/inactive", ApiController.getInactive)
router.get("/animals", ApiController.findAnimals)
router.get("/cropper", ApiController.findCropper)
router.post("/schedule-attack", ApiController.addScheduleAttack)
router.get("/own-villages", ApiController.getOwnVillages)

module.exports = router
