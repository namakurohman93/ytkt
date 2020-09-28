module.exports = function(sequelize) {
  const { player, population } = sequelize.models

  player.hasMany(population)
  population.belongsTo(player)
}
