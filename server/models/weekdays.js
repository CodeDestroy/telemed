'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WeekDays extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WeekDays.hasMany(models.Schedule, { foreignKey: 'scheduleDayId' });
    }
  }
  WeekDays.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WeekDays',
  });
  return WeekDays;
};