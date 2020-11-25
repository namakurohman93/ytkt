const { Op } = require("sequelize")
const cronJob = require("../utilities/cron-job")
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
  getAllPlayers: function(req, res) {
    let offset = 0
    let limit = 10

    let { page } = req.query

    if (page) offset = page * limit

    let options = {
      offset,
      limit,
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }

    if (req.query.name) {
      options.where = {
        name: {
          [Op.like]: `%${req.query.name}%`
        }
      }
    }

    Player.findAll(options)
      .then(players => res.json(players))
      .catch(err => res.send(err))
  },
  getPlayer: function(req, res) {
    let { playerId } = req.params
    let options = {
      include: {
        model: Population,
        attributes: {
          exclude: ["id", "updatedAt"]
        }
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }

    Player.findByPk(playerId, options)
      .then(player => res.json(player))
      .catch(err => res.send(err))
  },
  getInactive: function(req, res) {
    let offset = 0
    let { days, hours, page, evolution } = req.query

    if (evolution == undefined) evolution = 0
    if (days == undefined) days = 7
    if (page) offset = +page * 10

    findInactive(+days, +hours, +offset, +evolution)
      .then(result => res.json(result))
      .catch(err => res.send(err))
  },
  findAnimals: function(req, res) {
    let animals = Object.keys(req.query)

    findAnimals(animals)
      .then(result => res.json(result))
      .catch(err => res.send(err))
  }
}
