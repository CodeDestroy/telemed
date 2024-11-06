'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SlotStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SlotStatus.hasMany(models.Slots, { foreignKey: 'slotStatusId' });
    }
  }
  SlotStatus.init({
    slotStatusName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SlotStatus',
  });
  return SlotStatus;
};