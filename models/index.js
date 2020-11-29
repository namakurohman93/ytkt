/*
 * const { Sequelize } = require("sequelize")
 * 
 * const kingdom = require("./kingdom.js")
 * const player = require("./player")
 * const population = require("./population")
 * const village = require("./village")
 * 
 * const association = require("./association")
 * 
 * const sequelize = new Sequelize({
 *   dialect: "sqlite",
 *   storage: "./data/ytkt-db.sqlite",
 *   logging: false
 * })
 * 
 * // order is important
 * kingdom(sequelize)
 * player(sequelize)
 * village(sequelize)
 * population(sequelize)
 * 
 * association(sequelize)
 * 
 * module.exports = sequelize
 */
