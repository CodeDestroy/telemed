'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersSettings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UsersSettings.belongsTo(models.Users, { foreignKey: 'userId' });
      UsersSettings.belongsTo(models.Settings, { foreignKey: 'settingId' });
    }
  }
  UsersSettings.init({
    userId: DataTypes.INTEGER,
    settingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsersSettings',
  });
  return UsersSettings;
};