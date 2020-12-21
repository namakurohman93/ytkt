const fs = require("fs")
const { models } = require("../models")
const { getState, setState } = require("../store")
const { CronJob } = require("cron")
const authenticate = require("../features/login")
const requestMapData = require("../features/request-map-data")

function upsertPlayerPopulation(player) {
  return new Promise((resolve, reject) => {
    const { id, name, tribeId, kingdom, isActive, population } = player
    const upsertPlayer = { id, name, tribeId, kingdom, isActive }

    models.Player.upsert(upsertPlayer, {
      validate: false,
      returning: false,
      hooks: false
    })
      .then(_ => models.Population.create({ playerId: id, population }))
      .then(resolve)
      .catch(reject)
  })
}

function consumeMapData() {
  return new Promise((resolve, reject) => {
    requestMapData()
      .then(data => {
        if (data.error) throw data

        const cells = Object.keys(data.response["1"].region)
          .reduce((a, id) => [...a, ...data.response["1"].region[id]], [])
          .filter(cell => cell.playerId != undefined)

        const promises = Object.keys(data.response["1"].player)
          .filter(playerId => playerId != -1)
          .map(playerId => {
            const { name, tribeId, active, kingdomId } = data.response[
              "1"
            ].player[playerId]

            let kingdom = ""

            if (kingdomId != 0) {
              kingdom = data.response["1"].kingdom[kingdomId].tag
            }

            const population = cells
              .filter(cell => cell.playerId == playerId)
              .reduce((a, cell) => a + +cell.village.population, 0)

            return upsertPlayerPopulation({
              id: playerId,
              name,
              tribeId,
              kingdom,
              isActive: active,
              population
            })
          })

        return Promise.allSettled(promises)
      })
      .then(resolve)
      .catch(reject)
  })
}

async function task() {
  try {
    await consumeMapData()
  } catch (e) {
    if (e.error && e.error.message === "Authentication failed") {
      let {
        email,
        password,
        gameworldName: gameworld,
        isDual,
        avatarName
      } = getState()
      let {
        msid,
        cookies,
        lobbySession,
        gameworldSession
      } = await authenticate({ email, password, gameworld, isDual, avatarName })

      setState({ msid, cookies, lobbySession, gameworldSession })

      // let's try once again

      try {
        await consumeMapData()
      } catch (e) {
        // alright i'm giving up

        fs.writeFileSync(
          `./error-${Date.now()}.json`,
          JSON.stringify(e, null, 2)
        )
        console.log(`Error happening at ${new Date()}`)
        console.log(`This error is happen at second attempt`)
        console.log(e)
      }
    } else {
      fs.writeFileSync(`./error-${Date.now()}.json`, JSON.stringify(e, null, 2))
      console.log(`Error happening at ${new Date()}`)
      console.log(e)
    }
  }
}

function cronJob(schedule = "0 */1 * * *") {
  return new CronJob(schedule, task)
}

module.exports = cronJob
