'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DoctorPermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DoctorPermissions.belongsTo(models.Doctors, { foreignKey: 'doctorId' });
      DoctorPermissions.belongsTo(models.Permissions, { foreignKey: 'permissionId' });
      DoctorPermissions.belongsTo(models.Users, { as: 'grantedByAdmin', foreignKey: 'grantedBy' });
    }
  }
  DoctorPermissions.init({
    doctorId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER,
    grantedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DoctorPermissions',
  });
  return DoctorPermissions;
};