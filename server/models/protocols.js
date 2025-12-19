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
            unique: true,
        },

        mkb_diagnosis_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // Диагностическая гипотеза (синдромальный диагноз)
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        complaints: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        anamnesis_disease: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        anamnesis_life: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        vaccination: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        allergy_anamnesis: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        epid_anamnesis: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        objective_data: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        goal: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        additional_data: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        treatment_before: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        examination_plan: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        recommendations: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        treatment_recommendations: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        follow_up: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
        },
    }, {
        sequelize,
        modelName: 'Protocol',
        
    });

  return Protocol;
};
