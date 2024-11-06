'use strict';
require('dotenv').config()
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      login: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userRoleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'UsersRoles', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: `${process.env.SERVER_URL}images/defaultAvatar.png`
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      confirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      confirmCode: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};