'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Patients.belongsTo(models.Users, { foreignKey: 'userId' });
      Patients.hasMany(models.Slots, { foreignKey: 'patientId' });
      Patients.hasMany(models.Child, {
        foreignKey: 'patientId',
        onDelete: 'CASCADE',
      });
    }
  }
  Patients.init({
    userId: DataTypes.INTEGER,
    secondName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    patronomicName: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY,
    snils: DataTypes.STRING,
    info: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Patients',
  });
  return Patients;
};