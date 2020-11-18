const { getState } = require("../store")
const httpClient = require("../utilities/http-client")
const requestMapData = require("./request-map-data")

function getCache(params) {
  return new Promise((resolve, reject) => {
    let { gameworldSession, cookies, gameworldName: gameworld } = getState()

    let payload = {
      action: "get",
      controller: "cache",
      params,
      session: gameworldSession
    }
    let options = { headers: { "Cookie": cookies } }
    let date = Math.floor(Number(Date.now()) / 1000)
    let url = `https://${gameworld}.kingdoms.com/api/?c=cache&a=get&t${date}=`

    httpClient.post(url, payload, options)
      .then(({ data }) => resolve(data))
      .catch(reject)
  })
}

module.exports = function(animals) {
  // animals = ["1", "2", "3"]

  return new Promise((resolve, reject) => {
    requestMapData()
      .then(({ response }) => {
        const oasisStatus = "3" // "1" Occupied, "3" Unoccupied

        const oases = Object.keys(response["1"].region)
          .reduce((a, regionId) => [...a, ...response["1"].region[regionId]], [])
          .filter(cell => cell.oasis && cell.oasis.oasisStatus == oasisStatus)
          .map(oasis => `MapDetails:${oasis.id}`)

        return getCache({ names: oases })
      })
      .then(data => {
        const result = data.cache.map(cell => {
          return {
            id: cell.data.troops.villageId,
            units: cell.data.troops.units
          }
        })
          .filter(res => Object.keys(res.units).some(unit => animals.includes(unit)))

        resolve(result)
      })
      .catch(reject)
  })
}
