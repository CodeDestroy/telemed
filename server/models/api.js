'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class API extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      API.belongsTo(models.MedicalOrgs, { foreignKey: 'medOrgId' });
    }
  }
  API.init({
    apiName: DataTypes.STRING,
    apiKey: DataTypes.STRING,
    apiSecret: DataTypes.STRING,
    apiUrl: DataTypes.STRING,
    apiType: DataTypes.STRING,
    apiVersion: DataTypes.STRING,
    medOrgId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'API',
  });
  return API;
};