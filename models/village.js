/*
 * const { DataTypes } = require("sequelize")
 * 
 * module.exports = function(sequelize) {
 *   sequelize.define("Village", {
 *     tkCellId: {
 *       allowNull: false,
 *       primaryKey: true,
 *       type: DataTypes.INTEGER
 *     },
 *     name: {
 *       allowNull: false,
 *       type: DataTypes.STRING(25)
 *     },
 *     resType: {
 *       allowNull: false,
 *       type: DataTypes.STRING(5)
 *     },
 *     playerId: {
 *       allowNull: false,
 *       type: DataTypes.INTEGER,
 *       references: {
 *         model: "Players",
 *         key: "tkPlayerId"
 *       },
 *       onUpdate: "cascade",
 *       onDelete: "cascade"
 *     },
 *     owner: {
 *       allowNull: false,
 *       type: DataTypes.INTEGER
 *     }
 *   })
 * }
 */
