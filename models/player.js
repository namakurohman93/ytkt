const { DataTypes } = require("sequelize")

module.exports = function (sequelize) {
  sequelize.define("player", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(25)
    },
    tkPlayerId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    tribeId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    kingdomId: {
      type: DataTypes.INTEGER
    }
  })
}
