'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doctors.belongsTo(models.Users, { foreignKey: 'userId' });
      Doctors.belongsTo(models.MedicalOrgs, { foreignKey: 'medOrgId' });
      /* Doctors.belongsTo(models.Posts, { foreignKey: 'postId' }); */
      Doctors.belongsToMany(models.Posts, {
        through: 'DoctorPosts',
        foreignKey: 'doctorId',
        otherKey: 'postId'
      });
      Doctors.hasMany(models.Slots, { foreignKey: 'doctorId' });
      Doctors.hasMany(models.Schedule, { foreignKey: 'doctorId' });
      Doctors.hasMany(models.PromoCodes, { foreignKey: 'doctorId' });

      Doctors.belongsToMany(models.Permissions, {
        through: 'DoctorPermissions',
        foreignKey: 'doctorId',
        otherKey: 'permissionId',
        as: 'permissions'
      });
    }
  }
  Doctors.init({
    userId: DataTypes.INTEGER,
    secondName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    patronomicName: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY,
    snils: DataTypes.STRING,
    medOrgId: DataTypes.INTEGER,
    //postId: DataTypes.INTEGER,
    info: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Doctors',
  });
  return Doctors;
};