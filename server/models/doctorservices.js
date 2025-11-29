'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DoctorServices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DoctorServices.belongsTo(models.Doctors, { foreignKey: 'doctorId' });
      DoctorServices.belongsTo(models.Services, { foreignKey: 'serviceId' });
    }
  }
  DoctorServices.init({
    doctorId: DataTypes.INTEGER,
    serviceId: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'DoctorServices',
  });
  return DoctorServices;
};