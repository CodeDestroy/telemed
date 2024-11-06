'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('APIs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      apiName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      apiKey: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apiSecret: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apiUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apiType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apiVersion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      medOrgId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'MedicalOrgs', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
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
    await queryInterface.dropTable('APIs');
  }
};