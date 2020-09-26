const { CronJob } = require("cron")
const { getState } = require("../store")
const httpClient = require("./http-client")

async function task() {
  // it should have error handler
  try {
    let { gameworldSession, cookies } = getState()

    let data = {
      action: "",
      controller: "",
      params: {},
      session: gameworldSession
    }

    console.log("Task running at", new Date())
  } catch (e) {
    console.log(e)
    console.log("Error happening")
  }
}

function cronJob(schedule = "0 */1 * * *") {
  return new CronJob(schedule, task)
}

module.exports = cronJob
