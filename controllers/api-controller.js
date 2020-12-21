const { Op } = require("sequelize")
const cellId = require("../utilities/cell-id")
const cronJob = require("../utilities/cron-job")
const createDate = require("../utilities/create-date")
const FarmlistSender = require("../utilities/farmlist-sender")
const { getState, setState } = require("../store")
const { models } = require("../models")
const authenticate = require("../features/login")
const findAnimals = require("../features/find-animals")
const searchCropper = require("../features/find-cropper")
const scheduleAttack = require("../features/schedule-attack")
const requestFarmlistVillage = require("../features/request-farmlist-village")

module.exports = {
  getStatus: function(req, res) {
    let { email, password, gameworldName } = getState()

    res.json({
      response: {
        isLogin: !!email && !!password,
        email,
        gameworld: gameworldName
      }
    })
  },
  loginHandler: function(req, res) {
    let { email, password, gameworld, isDual, avatarName } = req.body
    gameworld = gameworld.toLowerCase()

    authenticate({ email, password, gameworld, isDual, avatarName })
      .then(({ msid, cookies, lobbySession, gameworldSession }) => {
        setState({
          email,
          password,
          gameworldName: gameworld,
          msid,
          cookies,
          lobbySession,
          gameworldSession,
          isDual,
          avatarName
        })

        let { cronJob: cron } = getState()

        if (!cron.isRunning) {
          let job = cronJob()
          job.start()

          setState({ cronJob: { isRunning: true, job } })
        }

        res.json({
          response: {
            isLogin: !!email && !!password,
            email,
            gameworld: gameworld
          }
        })
      })
      .catch(err => {
        res.status(403).json({
          error: true,
          message: "Make sure your credential is correct and try again"
        })
      })
  },
  getPlayers: function(req, res) {
    let { max, day, hour } = req.query

    if (!max) max = 0
    if (!day) day = 1
    if (!hour) hour = 0

    let options = {
      where: {
        createdAt: {
          [Op.gte]: new Date(createDate(+day, +hour)).toUTCString()
        }
      },
      attributes: {
        exclude: ["updatedAt"]
      },
      include: [
        {
          model: models.Player,
          attributes: ["id", "name", "tribeId", "kingdom", "isActive"]
        }
      ]
    }

    models.Population.findAll(options)
      .then(result => {
        let players = result
          .map(r => r.toJSON())
          .reduce((a, pop) => {
            if (!a[pop.Player.id]) {
              a[pop.Player.id] = { ...pop.Player, populations: [] }
            }

            let { id, population, createdAt } = pop

            a[pop.Player.id].populations.push({ id, population, createdAt })

            return a
          }, {})

        players = Object.values(players)
          .map(player => {
            let { id, name, tribeId, kingdom, isActive, populations } = player

            populations = populations.sort((a, b) => {
              return a.createdAt - b.createdAt
            })

            let evolution = 0

            if (populations.length > 1) {
              evolution =
                populations[populations.length - 1].population -
                populations[0].population
            }

            return { id, name, tribeId, kingdom, isActive, evolution }
          })
          .filter(player => player.evolution <= +max)

        res.json(players)
      })
      .catch(err => {
        res.status(500).json({ error: true, message: "Internal error" })
      })
  },
  getPlayerDetail: function(req, res) {
    let { playerId } = req.params

    let options = {
      attributes: {
        exclude: ["id", "createdAt", "updatedAt"]
      },
      include: [
        {
          model: models.Population,
          attributes: ["population", "createdAt"]
        }
      ]
    }

    models.Player.findByPk(playerId, options)
      .then(player => res.json(player))
      .catch(err => {
        res.status(500).json({ error: true, message: "Internal error" })
      })
  },
  findAnimals: function(req, res) {
    let animals = Object.keys(req.query)

    if (animals.length == 0) {
      res.status(400).json({ error: true, message: "Animal is required" })
    } else {
      findAnimals(animals)
        .then(result => res.json(result))
        .catch(err => {
          res.status(500).json({ error: true, message: "Internal error" })
        })
    }
  },
  findCropper: function(req, res) {
    searchCropper()
      .then(croppers => res.json(croppers))
      .catch(err => {
        res.status(500).json({ error: true, message: "Internal error" })
      })
  },
  getScheduleAttack: function(req, res) {
    let { scheduleAttacks } = getState()
    let response = scheduleAttacks.map(s => {
      let { id, units, catapultTargets, status, target, end, errorMessage } = s
      return { id, units, catapultTargets, status, target, end, errorMessage }
    })

    res.json(response)
  },
  addScheduleAttack: function(req, res) {
    let date = new Date(req.body.date)
    let target = cellId(req.body.x, req.body.y)
    let { units, villageId, catapultTargets } = req.body

    scheduleAttack(date, units, target, villageId, catapultTargets)

    let { scheduleAttacks } = getState()
    let response = scheduleAttacks.map(s => {
      let { id, units, catapultTargets, status, target, end, errorMessage } = s
      return { id, units, catapultTargets, status, target, end, errorMessage }
    })

    res.json(response)
  },
  deleteScheduleAttack: function(req, res) {
    let { id } = req.params
    let { scheduleAttacks } = getState()
    let index = scheduleAttacks.findIndex(e => e.id == id)

    if (index != -1) {
      let scheduleAttack = scheduleAttacks.splice(index, 1)[0]
      clearTimeout(scheduleAttack.task)
      setState({ scheduleAttacks })
    }

    let response = scheduleAttacks.map(s => {
      let { id, units, catapultTargets, status, target, end, errorMessage } = s
      return { id, units, catapultTargets, status, target, end, errorMessage }
    })

    res.json(response)
  },
  getFarmlistVillage: function(req, res) {
    let { email, password } = getState()

    if (!!email && !!password) {
      requestFarmlistVillage()
        .then(result => res.json(result))
        .catch(err => {
          res.status(500).json({ error: true, message: "Internal error" })
        })
    } else {
      res.status(403).json({ error: true, message: "Need to login first!" })
    }
  },
  getFarmlistSender: function(req, res) {
    let { farmlists } = getState()
    res.json(farmlists)
  },
  addFarmlistSender: function(req, res) {
    let { farmlists } = getState()
    let newFarmlistSender = new FarmlistSender(req.body)
    newFarmlistSender.start()

    farmlists = [...farmlists, newFarmlistSender]

    setState({ farmlists })

    res.json(farmlists)
  },
  toggleFarmlistSender: function(req, res) {
    let { farmlistSenderId, checked } = req.body
    let { farmlists } = getState()

    let fl = farmlists.find(f => f.id == farmlistSenderId)

    if (checked) {
      fl.start()
    } else {
      fl.stop()
    }

    setState({ farmlists })

    res.json(farmlists)
  },
  deleteFarmlistSender: function(req, res) {
    let { id } = req.params
    let { farmlists } = getState()
    let index = farmlists.findIndex(f => f.id == id)

    if (index != -1) {
      let farmlist = farmlists.splice(index, 1)[0]
      farmlist.stop()
      delete farmlist
      setState({ farmlists })
    }

    res.json(farmlists)
  }
}
