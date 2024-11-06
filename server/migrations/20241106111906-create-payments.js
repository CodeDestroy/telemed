'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
      },
      payTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PayTypes', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      slotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Slots', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
      },
      paymentDetails: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('Payments');
  }
};