'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Attachments extends Model {
        static associate(models) {
            Attachments.belongsTo(models.Slots, { foreignKey: 'slotId'});
            Attachments.belongsTo(models.Patients, { foreignKey: 'patientId'});
        }
    }

    Attachments.init({
        slotId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        filename: DataTypes.STRING,
        originalname: DataTypes.STRING,
        mime: DataTypes.STRING,
        size: DataTypes.BIGINT,
        url: DataTypes.STRING,
        hash: { type: DataTypes.STRING, allowNull: true },
    }, {
        sequelize,
        modelName: 'Attachments',
    });

    return Attachments;
};
