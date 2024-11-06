'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serviceName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      serviceShortName: {
        type: Sequelize.STRING,
        allowNull: true
  
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timeDurationMinutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30
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
    await queryInterface.dropTable('Services');
  }
};