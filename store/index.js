const merge = require("lodash/fp/merge")

let state = {
  email: "",
  password: "",
  gameworldName: "",
  msid: "",
  cookies: "",
  lobbySession: "",
  gameworldSession: "",
  cronJob: {
    isRunning: false,
    job: null
  }
}

if (process.env.NODE_ENV == "development") {
  state.email = process.env.EMAIL
  state.password = process.env.PASSWORD
  state.gameworldName = process.env.GAMEWORLD_NAME
  state.msid = process.env.MSID
  state.cookies = process.env.COOKIES
  state.lobbySession = process.env.LOBBY_SESSION
  state.gameworldSession = process.env.GAMEWORLD_SESSION
}

function getState() {
  return state
}

function setState(newState) {
  state = merge(state, newState)
}

module.exports = { getState, setState }
