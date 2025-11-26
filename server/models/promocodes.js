'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PromoCodes extends Model {
    static associate(models) {
      PromoCodes.belongsTo(models.Doctors, { foreignKey: 'doctorId' });
    }
  }

  PromoCodes.init({
    code: DataTypes.STRING,
    discountType: DataTypes.STRING, // percent / fixed
    discountValue: DataTypes.INTEGER,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    doctorId: DataTypes.INTEGER,
    usageLimit: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PromoCodes',
  });

  return PromoCodes;
};
