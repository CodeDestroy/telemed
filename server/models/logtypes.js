'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LogTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LogTypes.hasMany(models.Logs, { foreignKey: 'logTypeId' });
    }
  }
  LogTypes.init({
    logTypeName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LogTypes',
  });
  return LogTypes;
};