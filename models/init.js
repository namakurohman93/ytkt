const { player, population } = require("./index").models

function initTable() {
  player.sync()
    .then(() => console.log("Success sync player table"))
    .catch(err => {
      console.log(err)
      console.log("Failed sync player table")
    })

  population.sync()
    .then(() => console.log("Success sync population table"))
    .catch(err => {
      console.log(err)
      console.log("Failed sync population table")
    })
}

initTable()
