'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
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
    scheduleServiceTypeId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};