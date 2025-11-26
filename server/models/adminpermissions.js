'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminPermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AdminPermissions.belongsTo(models.Admins, { foreignKey: 'adminId' });
      AdminPermissions.belongsTo(models.Permissions, { foreignKey: 'permissionId' });
      AdminPermissions.belongsTo(models.Users, { as: 'grantedByAdmin', foreignKey: 'grantedBy' });
    }
  }
  AdminPermissions.init({
    adminId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER,
    grantedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AdminPermissions',
  });
  return AdminPermissions;
};