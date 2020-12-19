module.exports = function(sequelize) {
  const { models } = sequelize

  models.Player.hasMany(models.Population, { foreignKey: "playerId" })
  models.Population.belongsTo(models.Player, { foreignKey: "playerId" })
}
