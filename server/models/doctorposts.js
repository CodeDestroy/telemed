'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DoctorPosts extends Model {}
  DoctorPosts.init({
    doctorId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DoctorPosts',
    timestamps: true,
  });
  return DoctorPosts;
};
