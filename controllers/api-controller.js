const { Op } = require("sequelize")
const cronJob = require("../utilities/cron-job")
const authenticate = require("../features/login")
const findInactive = require("../features/find-inactive")
const { getState, setState } = require("../store")
const { player: Player, population: Population } = require("../models").models

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
      .catch(err => res.send(err))
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
  }
}
