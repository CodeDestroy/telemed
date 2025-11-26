'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Admins.belongsTo(models.Users, { foreignKey: 'userId' });
      Admins.belongsTo(models.MedicalOrgs, { foreignKey: 'medOrgId' });
      Admins.belongsToMany(models.Permissions, {
        through: 'AdminPermissions',
        foreignKey: 'adminId',
        otherKey: 'permissionId',
        as: 'permissions'
      });
    }
  }
  Admins.init({
    userId: DataTypes.INTEGER,
    secondName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    patronomicName: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY,
    medOrgId: DataTypes.INTEGER,
    info: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Admins',
  });
  return Admins;
};