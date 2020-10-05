const lodash = require("lodash")

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

function getState() {
  return state
}

function setState(newState) {
  state = lodash.merge(state, newState)
}

module.exports = { getState, setState }
