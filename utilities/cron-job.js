const fs = require("fs")
const { models } = require("../models")
const { getState, setState } = require("../store")
const { CronJob } = require("cron")
const authenticate = require("../features/login")
const requestMapData = require("../features/request-map-data")

function upsertKingdom(kingdom) {
  return new Promise((resolve, reject) => {
    models.Kingdom.upsert(kingdom)
      .then(resolve)
      .catch(reject)
  })
}

function upsertPlayer(player) {
  return new Promise((resolve, reject) => {
    models.Player.upsert(player)
      .then(resolve)
      .catch(reject)
  })
}

function upsertVillage(village) {
  return new Promise((resolve, reject) => {
    models.Village.upsert(village)
      .then(resolve)
      .catch(reject)
  })
}

async function task() {
  let notDone = true

  while (notDone) {
    try {
      let data = await requestMapData()

      if (data.error) throw data

      let promises

      const players = Object.keys(data.response["1"].player).map(tkPlayerId => {
        const { name, tribeId, kingdomId, active } = data.response["1"].player[tkPlayerId]
        return { tkPlayerId, name, tribeId, kingdomId, isActive: active }
      })

      const kingdoms = Object.keys(data.response["1"].kingdom).map(tkKingdomId => ({
        tkKingdomId, name: data.response["1"].kingdom[tkKingdomId].tag
      }))
      kingdoms.push({ tkKingdomId: 0, name: "" })

      const villages = []
      const populations = []

      Object.keys(data.response["1"].region).forEach(regionId => {
        data.response["1"].region[regionId].forEach(cell => {
          if (cell.village) {
            const {
              id: tkCellId,
              village: { name, population },
              resType,
              playerId,
              owner
            } = cell
            villages.push({ tkCellId, name, resType, playerId, owner })
            populations.push({ population , villageId: tkCellId })
          }
        })
      })

      promises = kingdoms.map(upsertKingdom)
      await Promise.all(promises)

      promises = players.map(upsertPlayer)
      await Promise.all(promises)

      promises = villages.map(upsertVillage)
      await Promise.all(promises)

      await models.Population.bulkCreate(populations)

      notDone = false
    } catch (e) {
      if (e.error && e.error.message == "Authentication failed") {
        let { email, password, gameworldName: gameworld } = getState()
        try {
          let { msid, cookies, lobbySession, gameworldSession } = await authenticate({ email, password, gameworld })

          setState({ msid, cookies, lobbySession, gameworldSession })
        } catch (e) {
          continue
        }
      } else {
        fs.writeFileSync(`./error-${Date.now()}.json`, JSON.stringify(e, null, 2))
        console.log("Error happening")
        // for now it will not try to sent request again
        notDone = false
      }
    }
  }
}

function cronJob(schedule = "0 */1 * * *") {
  return new CronJob(schedule, task)
}

module.exports = cronJob
