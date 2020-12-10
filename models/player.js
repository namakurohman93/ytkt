const { DataTypes } = require("sequelize")

module.exports = function(sequelize) {
  sequelize.define("Player", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(25)
    },
    tribeId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    kingdom: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    isActive: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  })
}
