'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slots extends Model {
    static associate(models) {
      Slots.belongsTo(models.Doctors, { foreignKey: 'doctorId' });
      Slots.belongsTo(models.Services, { foreignKey: 'serviceId' });
      Slots.belongsTo(models.Patients, { foreignKey: 'patientId' });
      Slots.belongsTo(models.SlotStatus, { foreignKey: 'slotStatusId' });
      Slots.hasOne(models.Rooms, { foreignKey: 'slotId' });
      Slots.hasOne(models.Payments, { foreignKey: 'slotId' });
      Slots.hasMany(models.Attachments, { foreignKey: 'slotId' });
      Slots.hasOne(models.PatientConsultationInfo, {
        foreignKey: 'slotId',
      });
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