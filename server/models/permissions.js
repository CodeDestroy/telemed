'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permissions.belongsToMany(models.UsersRoles, {
        through: 'RolePermissions',
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        as: 'roles'
      });

      Permissions.belongsToMany(models.Doctors, {
        through: 'DoctorPermissions',
        foreignKey: 'permissionId',
        otherKey: 'doctorId',
        as: 'doctorsWithPermission'
      });

      Permissions.belongsToMany(models.Admins, {
        through: 'AdminPermissions',
        foreignKey: 'permissionId',
        otherKey: 'adminId',
        as: 'adminsWithPermission'
      });
    }
  }
  Permissions.init({
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Permissions',
  });
  return Permissions;
};