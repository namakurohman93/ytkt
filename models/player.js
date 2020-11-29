/*
 * const { DataTypes } = require("sequelize")
 * 
 * module.exports = function(sequelize) {
 *   sequelize.define("Player", {
 *     tkPlayerId: {
 *       allowNull: false,
 *       primaryKey: true,
 *       type: DataTypes.INTEGER
 *     },
 *     name: {
 *       allowNull: false,
 *       type: DataTypes.STRING(25)
 *     },
 *     tribeId: {
 *       allowNull: false,
 *       type: DataTypes.INTEGER
 *     },
 *     kingdomId: {
 *       allowNull: false,
 *       type: DataTypes.INTEGER,
 *       references: {
 *         model: "Kingdoms",
 *         key: "tkKingdomId"
 *       },
 *       onUpdate: "cascade",
 *       onDelete: "cascade"
 *     },
 *     isActive: {
 *       allowNull: false,
 *       type: DataTypes.BOOLEAN
 *     }
 *   })
 * }
 */
