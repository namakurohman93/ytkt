const { Sequelize } = require("sequelize")
const player = require("./player")
const population = require("./population")
const association = require("./association")

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./ytkt-db.sqlite"
})

player(sequelize)
population(sequelize)

association(sequelize)

module.exports = sequelize
