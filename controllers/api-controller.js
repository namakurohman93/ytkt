const { Op } = require("sequelize")
const cronJob = require("../utilities/cron-job")
const createDate = require("../utilities/create-date")
const distance = require("../utilities/distance")
const authenticate = require("../features/login")
const findInactive = require("../features/find-inactive")
const { getState, setState } = require("../store")
const { models } = require("../models")
const findAnimals = require("../features/find-animals")

module.exports = {
  getStatus: function(req, res) {
    let { email, password, gameworldName, cronJob: { isRunning } } = getState()

    res.json({
      response: {
        isLogin: !!email && !!password,
        email,
        gameworld: gameworldName,
        job: { isRunning }
      }
    })
  },
  loginHandler: function(req, res) {
    let { email, password, gameworld } = req.body

    authenticate({ email, password, gameworld })
      .then(({ msid, cookies, lobbySession, gameworldSession }) => {
        setState({
          email,
          password,
          gameworldName: gameworld.toLowerCase(),
          msid,
          cookies,
          lobbySession,
          gameworldSession
        })

        /*
         * let { cronJob: cron } = getState()
         *
         * if (!cron.isRunning) {
         *   let job = cronJob()
         *   job.start()
         *
         *   setState({ cronJob: { isRunning: true, job } })
         * }
         */

        res.json({
          response: {
            isLogin: !!email && !!password,
            email,
            gameworld
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
  searchPlayer: function(req, res) {
    let { name } = req.query

    if (!name.trim()) {
      res.status(400).json({
        error: true, message: "Name is required"
      })
    } else {
      let options = {
        attributes: {
          exclude: ["createdAt", "updatedAt", "kingdomId", "tribeId"]
        },
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        }
      }

      models.Player.findAll(options)
        .then(players => res.json(players))
        .catch(err => {
          res.status(500).json({ error: true, message: "Internal error" })
        })
    }
  },
  getPlayerDetail: function(req, res) {
    let { playerId: tkPlayerId } = req.params

    let options = {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: [
        {
          model: models.Kingdom,
          attributes: ["name"]
        },
        {
          model: models.Village,
          attributes: ["tkCellId", "name", "owner", "resType"],
          include: [
            {
              model: models.Population,
              attributes: ["population", "createdAt"],
            }
          ]
        }
      ],
      where: { tkPlayerId },
      order: [
        [models.Village, "name", "asc"],
        [models.Village, { model: models.Population }, "createdAt", "asc"]
      ]
    }

    models.Player.findOne(options)
      .then(player => res.json(player))
      .catch(err => {
        res.status(500).json({ error: true, message: "Internal error" })
      })
  },
  searchKingdom: function(req, res) {
    let { name } = req.query

    if (!name.trim()) {
      res.status(400).json({
        error: true, message: "Kingdom name is required"
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
        const villages = players.map(player => player.toJSON())
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
                villagePopulation: village.Populations[village.Populations.length - 1].population,
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
          .sort((a, b) => distance(a.tkCellId, x, y) - distance(b.tkCellId, x, y))
          .filter(village => village.playerEvolution <= evolution)

        res.send(villages)
      })
      .catch(err => {
        res.status(500).json({ error: true, message: "Internal error" })
      })
  },
  findAnimals: function(req, res) {
    let animals = Object.keys(req.query)

    findAnimals(animals)
      .then(result => res.json(result))
      .catch(err => res.send(err))
  }
}
