'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Services extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Services.hasMany(models.Slots, { foreignKey: 'serviceId' });
      Services.hasMany(models.Schedule, { foreignKey: 'scheduleServiceTypeId' });
      Services.belongsToMany(models.Doctors, {
        through: 'DoctorServices',
        foreignKey: 'serviceId',
        otherKey: 'doctorId',
        as: 'doctorsWithService'
      });
    }
  }
  Services.init({
    serviceName: DataTypes.STRING,
    serviceShortName: DataTypes.STRING,
    price: DataTypes.INTEGER,
    timeDurationMinutes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Services',
  });
  return Services;
};