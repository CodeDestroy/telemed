'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PayTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PayTypes.hasMany(models.Payments, { foreignKey: 'payTypeId' });
    }
  }
  PayTypes.init({
    payTypeName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PayTypes',
  });
  return PayTypes;
};