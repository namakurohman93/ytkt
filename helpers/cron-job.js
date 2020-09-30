const { player: Player, population: Population } = require("../models").models
const { CronJob } = require("cron")
const requestMapData = require("./request-map-data")

function addData({ name, tribeId, kingdomId, tkPlayerId, population }) {
  return new Promise((resolve, reject) => {
    Player.findCreateFind({
      where: { tkPlayerId },
      defaults: { name, tribeId, kingdomId, tkPlayerId }
    })
      .then(([ player ]) => Population.create({ playerId: player.id, population }))
      .then(resolve)
      .catch(reject)
  })
}

async function task() {
  let notDone = true

  while (notDone) {
    try {
      let data = await requestMapData()
      // it should check the response, if there is any error idk what todo

      let cells = Object.keys(data.response["1"].region)
        .reduce((a, id) => [...a, ...data.response["1"].region[id]], [])
        .filter(cell => cell.playerId != undefined)

      let promises = Object.keys(data.response["1"].player)
        .map(tkPlayerId => {
          let { name, tribeId, kingdomId } = data.response["1"].player[tkPlayerId]
          let population = cells
            .filter(cell => cell.playerId == tkPlayerId)
            .reduce((a, cell) => +cell.village.population + a, 0)

          return addData({ name, tribeId, kingdomId, tkPlayerId, population })
        })

      await Promise.all(promises)

      notDone = false
    } catch (e) {
      console.log(e)
      console.log("Error happening")

      // for now it will not try to sent request again
      notDone = false
    }
  }
}

function cronJob(schedule = "0 */1 * * *") {
  return new CronJob(schedule, task)
}

module.exports = cronJob
