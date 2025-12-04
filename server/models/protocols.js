'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Protocol extends Model {
    static associate(models) {
        Protocol.belongsTo(models.mkbDiagnosis, {
            foreignKey: 'mkb_diagnosis_id',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });
        Protocol.belongsTo(models.Rooms, {
            foreignKey: 'room_id',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });
    }
  }

    Protocol.init({
        room_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true, // один протокол на одну комнату
        },
        mkb_diagnosis_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        //Описание диагноза
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        complaints: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        recommendations: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Protocol',
    });

  return Protocol;
};
