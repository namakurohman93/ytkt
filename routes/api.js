const router = require("express").Router()
const ApiController = require("../controllers/api-controller")

router.get("/status", ApiController.getStatus)
router.post("/login", ApiController.loginHandler)
router.get("/players", ApiController.getPlayers)
router.get("/players/:playerId", ApiController.getPlayerDetail)
router.get("/animals", ApiController.findAnimals)
router.get("/cropper", ApiController.findCropper)
router.get("/schedule-attack", ApiController.getScheduleAttack)
router.post("/schedule-attack", ApiController.addScheduleAttack)
router.delete("/schedule-attack/:id", ApiController.deleteScheduleAttack)
router.get("/farmlist-village", ApiController.getFarmlistVillage)
router.get("/farmlist-sender", ApiController.getFarmlistSender)
router.post("/farmlist-sender", ApiController.addFarmlistSender)
router.patch("/farmlist-sender", ApiController.toggleFarmlistSender)
router.delete("/farmlist-sender/:id", ApiController.deleteFarmlistSender)

module.exports = router
