'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Url extends Model {
    static associate(models) {
      Url.belongsTo(models.Users, { foreignKey: 'userId' });
      Url.belongsTo(models.Rooms, { foreignKey: 'roomId' });
    }
  }
  Url.init({
    originalUrl: DataTypes.TEXT,
    shortUrl: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER,
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'room',
    }
  }, {
    sequelize,
    modelName: 'Url',
  });
  return Url;
};