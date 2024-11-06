'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Slots.belongsTo(models.Doctors, { foreignKey: 'doctorId' });
      Slots.belongsTo(models.Services, { foreignKey: 'serviceId' });
      Slots.belongsTo(models.Patients, { foreignKey: 'patientId' });
      Slots.belongsTo(models.SlotStatus, { foreignKey: 'slotStatusId' });
      Slots.hasOne(models.Rooms, { foreignKey: 'slotId' });
      Slots.hasOne(models.Payments, { foreignKey: 'slotId' });
    }
  }
  Slots.init({
    doctorId: DataTypes.INTEGER,
    slotStartDateTime: DataTypes.DATE,
    slotEndDateTime: DataTypes.DATE,
    serviceId: DataTypes.INTEGER,
    isBusy: DataTypes.BOOLEAN,
    patientId: DataTypes.INTEGER,
    slotStatusId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Slots',
  });
  return Slots;
};