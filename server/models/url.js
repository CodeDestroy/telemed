'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Url extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Url.belongsTo(models.Users, { foreignKey: 'userId' });
      Url.belongsTo(models.Rooms, { foreignKey: 'roomId' });
    }
  }
  Url.init({
    originalUrl: DataTypes.TEXT,
    shortUrl: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Url',
  });
  return Url;
};