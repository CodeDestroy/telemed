'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UsersRoles.hasMany(models.Users, { foreignKey: 'userRoleId' });
      /* UsersRoles.hasMany(models.RolePermissions, { foreignKey: 'role_id' }); */
      UsersRoles.belongsToMany(models.Permissions, {
        through: models.RolePermissions,
        foreignKey: 'roleId',
        otherKey: 'permissionId',
        as: 'permissions'
      });
    }
  }
  UsersRoles.init({
    roleName: DataTypes.STRING,
    accessLevel: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsersRoles',
  });
  return UsersRoles;
};