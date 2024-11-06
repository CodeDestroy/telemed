'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Files.belongsTo(models.Messages, { foreignKey: 'messageId' });
    }
  }
  Files.init({
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    messageId: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Files',
  });
  return Files;
};