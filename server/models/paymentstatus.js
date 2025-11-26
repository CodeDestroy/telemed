'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentStatus extends Model {
    static associate(models) {
      PaymentStatus.hasMany(models.Payments, {
        foreignKey: 'paymentStatusId',
      });
    }
  }
  PaymentStatus.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'PaymentStatus',
    }
  );
  return PaymentStatus;
};
