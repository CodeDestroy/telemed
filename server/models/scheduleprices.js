'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SchedulePrices extends Model {
    static associate(models) {
      SchedulePrices.belongsTo(models.Schedule, { foreignKey: 'scheduleId' });
    }
  }

  SchedulePrices.init({
    scheduleId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    isFree: DataTypes.BOOLEAN,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'SchedulePrices',
  });

  return SchedulePrices;
};


