const { Sequelize } = require("sequelize")

const player = require("./player")
const population = require("./population")

const association = require("./association")

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/ytkt-db.sqlite",
  logging: false
})

player(sequelize)
population(sequelize)

association(sequelize)

module.exports = sequelize
