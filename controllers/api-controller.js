const { Op } = require("sequelize")
const cronJob = require("../helpers/cron-job")
const authenticate = require("../helpers/login")
const { getState, setState } = require("../store")
const {
  player: Player,
  population: Population
} = require("../models").models

class ApiController {
  static getStatus(req, res) {
    let { email, password, cronJob: { isRunning } } = getState()

    res.json({
      response: {
        isLogin: !!email && !!password,
        email,
        job: { isRunning }
      }
    })
  }

  static loginHandler(req, res) {
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
            message: "Login success!"
          }
        })
      })
      .catch(err => res.send(err))
  }

  static getAllPlayers(req, res) {
    let offset
    let limit = 10

    if (req.query.page == undefined) offset = 0
    else offset = req.query.page * limit

    let options = { offset, limit }

    if (req.query.name) {
      options.where = {
        name: {
          [Op.like]: `%${req.query.name}%`
        }
      }
    }

    Player.findAll(options)
      .then(players => res.send(players))
      .catch(err => res.send(err))
  }

  static getPlayer(req, res) {
    let { playerId } = req.params

    Player.findByPk(playerId, { include: Population })
      .then(player => res.send(player))
      .catch(err => res.send(err))
  }
}

module.exports = ApiController
