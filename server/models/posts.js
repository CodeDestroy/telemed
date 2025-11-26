'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      /* Posts.hasMany(models.Doctors, { foreignKey: 'postId' }); */
      Posts.belongsToMany(models.Doctors, {
        through: 'DoctorPosts',
        foreignKey: 'postId',
        otherKey: 'doctorId'
      });
    }
  }
  Posts.init(
    {
      postName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transliterationName: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Posts',
    }
  );

  return Posts;
};