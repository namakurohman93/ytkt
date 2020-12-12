const { getState, setState } = require("../store")
const authenticate = require("../features/login")
const httpClient = require("./http-client")

class FarmlistSender {
  constructor({ farmlistIds, villageId, interval, redFarmlistId }) {
    this.id = this.generateId()
    this.farmlistIds = farmlistIds
    this.villageId = villageId
    this.interval = +interval
    this.red = redFarmlistId
    this.run = false
  }

  async start() {
    this.run = true

    while (this.run) {
      try {
        await this.clearFarmlist()
        const r = await this.sentFarmlist()

        if (r.response && r.response.errors) {
          if (
            r.response.errors[0].message == "targetInNoobProtection" ||
            r.response.errors[0].message == "TargetOnVacation"
          ) {
            console.log(
              `Success sent farmlist from farmlist sender with id ${this.id}`
            )
          } else {
            console.log("Unknown error happend")
            console.log(r)
            this.run = false
          }
        } else if (r.error) {
          console.log(`Error in response, re-authenticate`)
          this.reAuthenticate()
        } else {
          console.log(
            `Success sent farmlist from farmlist sender with id ${this.id}`
          )
        }
      } catch (e) {
        console.log(e)
        console.log("Error happen when try to clear farmlist or sent farmlist")
      }

      // dont forget to random sleep time
      await this.sleep(this.generateRandomInterval())
    }

    this.run = false
    console.log(`farmlist sender with id "${this.id}" stopped`)
  }

  generateRandomInterval() {
    let temp = []
    let start = this.interval * 60 - 10
    let end = this.interval * 60 + 10

    for (; start < end; start++) {
      temp.push(start)
    }

    let randomIndex = Math.floor(Math.random() * temp.length)

    return temp[randomIndex] * 1000
  }

  stop() {
    this.run = false
    console.log(`stoping farmlist sender with id "${this.id}"`)
  }

  generateId() {
    return (
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .substr(2)
    )
  }

  sleep(miliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, miliseconds)
    })
  }

  async clearFarmlist() {
    for (let listId of this.farmlistIds) {
      const r = await this._requestFarmlistDetail(listId)

      if (r.cache) {
        for (let cache of r.cache[0].data.cache) {
          if (
            cache.data.lastReport &&
            ["2", "3"].includes(cache.data.lastReport.notificationType)
          ) {
            await this._toggleEntry(cache.data.villageId, listId)
            await this._toggleEntry(cache.data.villageId, this.red)
          }
        }
      }
    }
  }

  sentFarmlist() {
    return new Promise((resolve, reject) => {
      let { gameworldSession, cookies, gameworldName: gameworld } = getState()

      let payload = {
        action: "startFarmListRaid",
        controller: "troops",
        params: {
          listIds: this.farmlistIds,
          villageId: this.villageId
        },
        session: gameworldSession
      }
      let options = { headers: { Cookie: cookies } }
      let date = Math.floor(Number(Date.now()) / 1000)
      let url = `https://${gameworld}.kingdoms.com/api/?c=troops&a=startFarmListRaid&t${date}=`

      httpClient
        .post(url, payload, options)
        .then(({ data }) => resolve(data))
        .catch(reject)
    })
  }

  _requestFarmlistDetail(farmlistId) {
    return new Promise((resolve, reject) => {
      let { gameworldSession, cookies, gameworldName: gameworld } = getState()

      let payload = {
        action: "get",
        controller: "cache",
        params: {
          names: [`Collection:FarmListEntry:${farmlistId}`]
        },
        session: gameworldSession
      }
      let options = { headers: { Cookie: cookies } }
      let date = Math.floor(Number(Date.now()) / 1000)
      let url = `https://${gameworld}.kingdoms.com/api/?c=cache&a=get&t${date}=`

      httpClient
        .post(url, payload, options)
        .then(({ data }) => resolve(data))
        .catch(reject)
    })
  }

  _toggleEntry(villageId, listId) {
    return new Promise((resolve, reject) => {
      let { gameworldSession, cookies, gameworldName: gameworld } = getState()

      let payload = {
        action: "toggleEntry",
        controller: "farmList",
        params: { villageId, listId },
        session: gameworldSession
      }
      let options = { headers: { Cookie: cookies } }
      let date = Math.floor(Number(Date.now()) / 1000)
      let url = `https://${gameworld}.kingdoms.com/api/?c=farmList&a=toggleEntry&t${date}=`

      httpClient
        .post(url, payload, options)
        .then(({ data }) => resolve(data))
        .catch(reject)
    })
  }

  reAuthenticate() {
    return new Promise((resolve, reject) => {
      let { email, password, gameworldName: gameworld } = getState()
      authenticate({ email, password, gameworld })
        .then(session => {
          setState({ ...session })
          resolve()
        })
        .catch(reject)
    })
  }
}

module.exports = FarmlistSender
