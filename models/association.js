/*
 * module.exports = function(sequelize) {
 *   const { models } = sequelize
 *
 *   models.Kingdom.hasMany(models.Player, { foreignKey: "kingdomId" })
 *   models.Player.belongsTo(models.Kingdom, { foreignKey: "kingdomId" })
 *
 *   models.Player.hasMany(models.Village, { foreignKey: "playerId" })
 *   models.Village.belongsTo(models.Player, { foreignKey: "playerId" })
 *
 *   models.Village.hasMany(models.Population, { foreignKey: "villageId" })
 *   models.Population.hasMany(models.Village, { foreignKey: "villageId" })
 * }
 */
