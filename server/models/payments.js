'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payments.belongsTo(models.Users, { foreignKey: 'userId' });
      Payments.belongsTo(models.PayTypes, { foreignKey: 'payTypeId' });
      Payments.belongsTo(models.Slots, { foreignKey: 'slotId' });
    }
  }
  Payments.init({
    userId: DataTypes.INTEGER,
    payTypeId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    slotId: DataTypes.INTEGER,
    paymentDetails: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Payments',
  });
  return Payments;
};