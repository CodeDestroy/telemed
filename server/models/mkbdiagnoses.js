'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class mkbDiagnosis extends Model {
        static associate(models) {
            mkbDiagnosis.hasMany(models.Protocol, {
                foreignKey: 'mkb_diagnosis_id',
            });
            mkbDiagnosis.hasMany(models.mkbDiagnosis, {
                as: 'children',
                foreignKey: 'parent_id',
            });

            mkbDiagnosis.belongsTo(models.mkbDiagnosis, {
                as: 'parent',
                foreignKey: 'parent_id',
            });
        }
    }

    mkbDiagnosis.init({
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'mkbDiagnosis',
    });

    return mkbDiagnosis;
};
