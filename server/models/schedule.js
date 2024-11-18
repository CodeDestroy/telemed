'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Doctors, { foreignKey: 'doctorId' });
      Schedule.belongsTo(models.WeekDays, { foreignKey: 'scheduleDayId' });
      Schedule.belongsTo(models.Services, { foreignKey: 'scheduleServiceTypeId' });
    }
  }
  Schedule.init({
    doctorId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    scheduleDayId: DataTypes.INTEGER,
    scheduleStartTime: DataTypes.TIME,
    scheduleEndTime: DataTypes.TIME,
    scheduleStatus: DataTypes.INTEGER,
    scheduleServiceTypeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};