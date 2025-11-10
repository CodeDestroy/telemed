'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RolePermissions.belongsTo(models.UsersRoles, { foreignKey: 'roleId' });
      RolePermissions.belongsTo(models.Permissions, { foreignKey: 'permissionId' });
    }
  }
  RolePermissions.init({
    roleId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RolePermissions',
  });
  return RolePermissions;
};