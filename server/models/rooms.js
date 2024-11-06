'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Rooms.belongsToMany(models.Users, { through: 'users_rooms' });
      Rooms.belongsToMany(models.Users, {
        through: models.UsersRooms,
        foreignKey: 'roomId',
        otherKey: 'userId'
      })
      Rooms.hasMany(models.Messages, { foreignKey: 'roomId' });
      Rooms.hasMany(models.Url, { foreignKey: 'roomId' });
      Rooms.belongsTo(models.Slots, { foreignKey: 'slotId' });
    }
  }
  Rooms.init({
    roomName: DataTypes.STRING,
    token: DataTypes.TEXT,
    meetingStart: DataTypes.DATE,
    meetingEnd: DataTypes.DATE,
    ended: DataTypes.BOOLEAN,
    slotId: DataTypes.INTEGER,
    protocol: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Rooms',
  });
  return Rooms;
};