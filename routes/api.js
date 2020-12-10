const router = require("express").Router()
const ApiController = require("../controllers/api-controller")

router.get("/status", ApiController.getStatus)
router.post("/login", ApiController.loginHandler)
router.get("/players", ApiController.getPlayers)
router.get("/players/:playerId", ApiController.getPlayerDetail)
router.get("/kingdoms", ApiController.searchKingdom)
router.get("/kingdoms/:kingdomId", ApiController.getKingdomDetail)
router.get("/inactive", ApiController.getInactive)
router.get("/animals", ApiController.findAnimals)
router.get("/cropper", ApiController.findCropper)
router.get("/schedule-attack", ApiController.getScheduleAttack)
router.post("/schedule-attack", ApiController.addScheduleAttack)
router.delete("/schedule-attack/:id", ApiController.deleteScheduleAttack)
router.get("/own-villages", ApiController.getOwnVillages)

module.exports = router
