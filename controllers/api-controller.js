const cronJob = require("../helpers/cron-job")
const authenticate = require("../helpers/login")
const { getState, setState } = require("../store")

class ApiController {
  static getStatus(req, res) {
    let { email, password, job: { isRunning } } = getState()

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
            message: "Login success!"
          }
        })
      })
      .catch(err => res.send(err))
  }
}

module.exports = ApiController
