'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MedicalOrgs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MedicalOrgs.hasMany(models.Doctors, { foreignKey: 'medOrgId' });
      MedicalOrgs.hasMany(models.Admins, { foreignKey: 'medOrgId' });
      MedicalOrgs.hasMany(models.API, { foreignKey: 'medOrgId' });
    }
  }
  MedicalOrgs.init({
    medOrgName: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    inn: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MedicalOrgs',
  });
  return MedicalOrgs;
};