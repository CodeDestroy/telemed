'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Slots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Patients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false
      },
      originalname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      size: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      url: { // можно хранить относительный путь или ссылку
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // индекс для быстрого поиска по slotId
    await queryInterface.addIndex('Attachments', ['slotId']);
    await queryInterface.addIndex('Attachments', ['patientId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Attachments');
  }
};
