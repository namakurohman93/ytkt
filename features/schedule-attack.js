const { getState, setState } = require("../store")
const httpClient = require("../utilities/http-client")
const sentAttack = require("./sent-attack")

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

module.exports = function(date, units, target, villageId, catapultTargets = []) {
  const id = uid()
  const start = new Date()
  const timeout = date.getTime() - start.getTime()

  const { scheduleAttacks } = getState()

  scheduleAttacks.push({
    id,
    units,
    catapultTargets,
    status: "pending",
    target,
    end: date,
    errorMessage: null,
    task: setTimeout(({ id, units, target, villageId, catapultTargets }) => {
      sentAttack(units, target, villageId, catapultTargets)
        .then(data => {
          console.log(data, "<<< data di schedule-attack.js")

          const { scheduleAttacks } = getState()

          scheduleAttacks.forEach(e => {
            if (e.id == id) e.status = "success"
          })

          setState({ scheduleAttacks })
        })
        .catch(err => {
          console.log(err, "<<<<< error happen on schedule attack")

          const { scheduleAttacks } = getState()

          scheduleAttacks.forEach(e => {
            if (e.id == id) {
              e.status = "failed"
              e.errorMessage = "Error just happened"
            }
          })

          setState({ scheduleAttacks })
        })
    }, timeout, { id, units, target, villageId, catapultTargets })
  })

  setState({ scheduleAttacks })
}
