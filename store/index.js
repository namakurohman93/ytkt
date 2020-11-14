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

function getState() {
  return state
}

function setState(newState) {
  state = merge(state, newState)
}

module.exports = { getState, setState }
