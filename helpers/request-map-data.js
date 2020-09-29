const { getState } = require("../store")
const httpClient = require("./http-client")
const regionIds = require("./region-ids")

module.exports = function() {
  return new Promise((resolve, reject) => {
    let { gameworldSession, cookies, gameworldName: gameworld } = getState()

    let payload = {
      action: "getByRegionIds",
      controller: "map",
      params: {
        regionIdCollection: {
          "1": regionIds
        }
      },
      session: gameworldSession
    }
    let options = { headers: { "Cookie": cookies } }
    let date = Math.floor(Number(Date.now()) / 1000)
    let url = `https://${gameworld}.kingdoms.com/api/?c=map&a=getByRegionIds&t${date}=`

    httpClient.post(url, payload, options)
      .then(({ data }) => resolve(data))
      .catch(reject)
  })
}
