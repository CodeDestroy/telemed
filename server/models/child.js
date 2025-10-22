'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Child extends Model {
        static associate(models) {
            Child.belongsTo(models.Patients, { foreignKey: 'patientId', onDelete: 'CASCADE',});
        }
    }

    Child.init({
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        patronymicName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        snils: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        polis: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        docSeries: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        docNumber: {
            type: DataTypes.STRING,
            allowNull: true,
      },
    }, {
        sequelize,
        modelName: 'Child',
    });

    return Child;
};
