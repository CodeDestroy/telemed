'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PatientConsultationInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PatientConsultationInfo.belongsTo(models.Slots, {
        foreignKey: 'slotId',
        as: 'slot',
      });
    }
  }
  PatientConsultationInfo.init({
    complaints: DataTypes.TEXT,
    diagnosis: DataTypes.TEXT,
    anamnesis: DataTypes.TEXT,
    comments: DataTypes.TEXT,
    slotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
  }, {
    sequelize,
    modelName: 'PatientConsultationInfo',
  });
  return PatientConsultationInfo;
};