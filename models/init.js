const { models } = require("./index")

function initTable() {
  models.Player.sync()
    .then(() => models.Population.sync())
    .then(() => console.log("Success sync tables"))
    .catch(err => console.log(err))
}

initTable()
