'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Logs.belongsTo(models.LogTypes, { foreignKey: 'logTypeId' });
      Logs.belongsTo(models.Users, { foreignKey: 'userId' });
    }
  }
  Logs.init({
    logTypeId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    logMessage: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Logs',
  });
  return Logs;
};