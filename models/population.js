const { DataTypes } = require("sequelize")

module.exports = function(sequelize) {
  sequelize.define("Population", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    population: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    playerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Players",
        key: "id"
      },
      onUpdate: "cascade",
      onDelete: "cascade"
    }
  })
}
