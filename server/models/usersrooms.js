'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UsersRooms.belongsTo(models.Users, { foreignKey: 'userId' });
      UsersRooms.belongsTo(models.Rooms, { foreignKey: 'roomId' });
    }
  }
  UsersRooms.init({
    userId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsersRooms',
  });
  return UsersRooms;
};