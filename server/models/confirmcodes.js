'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConfirmCodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ConfirmCodes.belongsTo(models.Users, { foreignKey: 'userId' });
    }
  }
  ConfirmCodes.init({
    code: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    expireDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ConfirmCodes',
  });
  return ConfirmCodes;
};