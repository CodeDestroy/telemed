'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    static associate(models) {
      Rooms.belongsToMany(models.Users, {
        through: models.UsersRooms,
        foreignKey: 'roomId',
        otherKey: 'userId'
      })
      Rooms.hasMany(models.Messages, { foreignKey: 'roomId' });
      Rooms.hasMany(models.Url, { foreignKey: 'roomId' });
      Rooms.belongsTo(models.Slots, { foreignKey: 'slotId' });
      
      Rooms.belongsTo(models.Child, { foreignKey: 'childId', onDelete: 'CASCADE' });
      Rooms.hasOne(models.Protocol, {
        foreignKey: 'room_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Rooms.init({
    roomName: DataTypes.STRING,
    token: DataTypes.TEXT,
    meetingStart: DataTypes.DATE,
    meetingEnd: DataTypes.DATE,
    ended: DataTypes.BOOLEAN,
    slotId: DataTypes.INTEGER,
    protocol: DataTypes.TEXT,
    sendCount: DataTypes.INTEGER,
    protocol_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Rooms',
  });
  return Rooms;
};