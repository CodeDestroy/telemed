'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Messages.belongsTo(models.Rooms, { foreignKey: 'roomId' });
      Messages.belongsTo(models.Users, { foreignKey: 'userId' });
      Messages.hasMany(models.Files, { foreignKey: 'messageId' });
    }
  }
  Messages.init({
    text: DataTypes.STRING,
    roomId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Messages',
  });
  return Messages;
};