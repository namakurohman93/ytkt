const { models } = require("./index")

function initTable() {
  models.Kingdom.sync()
    .then(() => {
      console.log("Succcess sync kingdom table")
      return models.Player.sync()
    })
    .then(() => {
      console.log("Success sync player table")
      return models.Village.sync()
    })
    .then(() => {
      console.log("Success sync village table")
      return models.Population.sync()
    })
    .then(() => {
      console.log("Success sync population table")
    })
    .catch((err) => {
      console.log(err)
      console.log("Error happen when sync table")
    })
}

initTable()
