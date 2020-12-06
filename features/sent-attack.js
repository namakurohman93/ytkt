const { getState } = require("../store")
const httpClient = require("../utilities/http-client")

module.exports = function(units, target, villageId, catapultTargets) {
  return new Promise((resolve, reject) => {
    let { gameworldSession, cookies, gameworldName: gameworld } = getState()

    let payload = {
      action: "send",
      controller: "troops",
      params: {
        catapultTargets,
        destVillageId: target,
        movementType: 3,
        redeployHero: false,
        spyMission: "resources",
        units,
        villageId
      },
      session: gameworldSession
    }
    let options = { headers: { Cookie: cookies } }
    let date = Math.floor(Number(Date.now()) / 1000)
    let url = `https://${gameworld}.kingdoms.com/api/?c=troops&a=send&t${date}=`

    httpClient
      .post(url, payload, options)
      .then(({ data }) => resolve(data))
      .catch(reject)
  })
}
