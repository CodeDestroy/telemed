'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Users.belongsTo(models.UsersRoles, { foreignKey: 'userRoleId' });
      Users.hasMany(models.Tokens, { foreignKey: 'userId' });
      /* Users.hasOne(models.Doctors, { foreignKey: 'userId' });
      Users.hasOne(models.Admins, { foreignKey: 'userId' }); */
      Users.hasMany(models.Doctors, { foreignKey: 'userId' });
      Users.hasMany(models.Admins, { foreignKey: 'userId' });
      Users.hasOne(models.Patients, { foreignKey: 'userId' });
      Users.hasMany(models.Messages, { foreignKey: 'userId' });
      /* Users.hasMany(models.Files, { foreignKey: 'userId' }); */
      Users.hasMany(models.Url, { foreignKey: 'userId' });
      Users.hasMany(models.Logs, { foreignKey: 'userId' });
      Users.hasMany(models.Payments, { foreignKey: 'userId' });

      
      Users.belongsToMany(models.Rooms, {
        through: models.UsersRooms,
        foreignKey: 'userId',
        otherKey: 'roomId'
      })
      Users.belongsToMany(models.Settings, {
        through: models.UsersSettings,
        foreignKey: 'userId',
        otherKey: 'settingId'
      })
      
    }
  }
  Users.init({
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    userRoleId: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN,
    confirmCode: DataTypes.TEXT,
    schedulerType: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};