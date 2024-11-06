'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Settings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Settings.belongsToMany(models.Users, { through: 'users_settings' });
      Settings.belongsToMany(models.Users, {
        through: models.UsersSettings,
        foreignKey: 'settingId',
        otherKey: 'userId'
      })
    }
  }
  Settings.init({
    settingName: DataTypes.STRING,
    settingValue: DataTypes.TEXT,
    settingType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Settings',
  });
  return Settings;
};