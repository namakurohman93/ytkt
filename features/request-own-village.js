const { getState } = require("../store")
const httpClient = require("../utilities/http-client")

module.exports = function() {
  return new Promise((resolve, reject) => {
    let { gameworldSession, cookies, gameworldName: gameworld } = getState()

    let payload = {
      action: "get",
      controller: "cache",
      params: { names: ["Collection:Village:own"] },
      session: gameworldSession
    }
    let options = { headers: { Cookie: cookies } }
    let date = Math.floor(Number(Date.now()) / 1000)
    let url = `https://${gameworld}.kingdoms.com/api/?c=cache&a=get&t${date}=`

    httpClient
      .post(url, payload, options)
      .then(({ data }) => {
        const villages = data.cache[0].data.cache.map(({ data }) => ({
          villageId: data.villageId,
          name: data.name,
          tribeId: data.tribeId
        }))

        resolve(villages)
      })
      .catch(reject)
  })
}
