const { Op } = require("sequelize")
const cellId = require("../utilities/cell-id")
const cronJob = require("../utilities/cron-job")
const distance = require("../utilities/distance")
const createDate = require("../utilities/create-date")
const authenticate = require("../features/login")
const findInactive = require("../features/find-inactive")
const { getState, setState } = require("../store")
const { models } = require("../models")
const findAnimals = require("../features/find-animals")
const searchCropper = require("../features/find-cropper")
const scheduleAttack = require("../features/schedule-attack")
const requestOwnVillage = require("../features/request-own-village")

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
    let { email, password, gameworld } = req.body
    gameworld = gameworld.toLowerCase()

    authenticate({ email, password, gameworld })
      .then(({ msid, cookies, lobbySession, gameworldSession }) => {
        setState({
          email,
          password,
          gameworldName: gameworld,
          msid,
          cookies,
          lobbySession,
          gameworldSession
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
          [Op.between]: [new Date(createDate(+day, +hour)), new Date()]
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
              evolution = populations[populations.length - 1] - populations[0]
            }

            return { id, name, tribeId, kingdom, isActive, evolution }
          })
          .filter(player => player.evolution <= +max)

        res.json(players)
      })
      .catch(err => {
        console.log(err)
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
  searchKingdom: function(req, res) {
    let { name } = req.query

    if (!name.trim()) {
      res.status(400).json({
        error: true,
        message: "Kingdom name is required"
      })
    } else {
      let options = {
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        },
        include: [
          {
            model: models.Player,
            attributes: ["tkPlayerId"]
          }
        ],
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        }
      }

      models.Kingdom.findAll(options)
        .then(kingdoms => {
          kingdoms = kingdoms.map(kingdom => kingdom.toJSON())
          kingdoms.forEach(kingdom => {
            kingdom.Players = kingdom.Players.length
          })

          res.json(kingdoms)
        })
        .catch(err => {
          res.status(500).json({ error: true, message: "Internal error" })
        })
    }
  },
  getKingdomDetail: function(req, res) {
    let { kingdomId } = req.params

    let options = {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: [
        {
          model: models.Player,
          attributes: ["tkPlayerId", "name", "isActive"],
          include: [
            {
              model: models.Village,
              attributes: ["owner"]
            }
          ]
        }
      ]
    }

    models.Kingdom.findByPk(kingdomId, options)
      .then(kingdom => {
        kingdom = kingdom.toJSON()
        kingdom.Players.forEach(player => {
          player.Villages = player.Villages.length
        })

        res.json(kingdom)
      })
      .catch(err => {
        res.status(500).json({ error: true, message: "Internal error" })
      })
  },
  getInactive: function(req, res) {
    let { x, y, evolution, day, hour, page } = req.query

    if (x == undefined || x == "") x = 0
    if (y == undefined || y == "") y = 0
    if (evolution == undefined || evolution == "") evolution = 0
    if (day == undefined || day == "") day = 1
    if (hour == undefined || hour == "") hour = 0

    let options = {
      where: {
        tkPlayerId: {
          [Op.not]: 1
        },
        "$Villages.Populations.createdAt$": {
          [Op.between]: [createDate(day, hour), createDate()]
        }
      },
      include: [
        {
          model: models.Village,
          attributes: ["tkCellId", "name", "resType", "owner"],
          include: [
            {
              model: models.Population,
              attributes: ["population", "createdAt"]
            }
          ]
        },
        {
          model: models.Kingdom,
          attributes: ["name"]
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "kingdomId"]
      }
    }

    models.Player.findAll(options)
      .then(players => {
        const villages = players
          .map(player => player.toJSON())
          .reduce((a, player) => {
            let result = []

            player.Villages.forEach(village => {
              village.Populations.forEach((population, idx) => {
                if (!result[idx]) result[idx] = 0
                result[idx] += population.population
              })
            })

            let playerEvolution = result[result.length - 1] - result[0]

            return [
              ...a,
              ...player.Villages.map(village => ({
                ...village,
                villagePopulation:
                  village.Populations[village.Populations.length - 1]
                    .population,
                player,
                playerEvolution
              }))
            ]
          }, [])
          .map(village => ({
            tkCellId: village.tkCellId,
            name: village.name,
            resType: village.resType,
            owner: village.owner,
            population: village.villagePopulation,
            playerName: village.player.name,
            tribeId: village.player.tribeId,
            isActive: village.player.isActive,
            kingdom: village.player.Kingdom.name,
            playerEvolution: village.playerEvolution
          }))
          .sort(
            (a, b) => distance(a.tkCellId, x, y) - distance(b.tkCellId, x, y)
          )
          .filter(village => village.playerEvolution <= evolution)

        res.send(villages)
      })
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
  getOwnVillages: function(req, res) {
    let { email, password } = getState()

    if (!!email && !!password) {
      requestOwnVillage()
        .then(villages => res.json(villages))
        .catch(err => {
          res.status(500).json({ error: true, message: "Internal error" })
        })
    } else {
      res.status(403).json({ error: true, message: "Need to login first!" })
    }
  }
}
