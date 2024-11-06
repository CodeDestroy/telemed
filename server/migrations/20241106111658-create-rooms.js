'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      token: {
        type: Sequelize.TEXT,
        
      },
      meetingStart: {
        type: Sequelize.DATE,
        allowNull: false
      },
      meetingEnd:  {
        type: Sequelize.DATE
      },
      ended: {
        type: Sequelize.BOOLEAN
      },
      slotId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Slots', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
      },
      protocol: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rooms');
  }
};