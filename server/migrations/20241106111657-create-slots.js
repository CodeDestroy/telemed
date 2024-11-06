'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Slots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Doctors', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
      },
      slotStartDateTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      slotEndDateTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      serviceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Services', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
      },
      isBusy: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Patients', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
      },
      slotStatusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
          model: 'SlotStatuses', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
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
    await queryInterface.dropTable('Slots');
  }
};