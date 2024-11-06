'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Schedules', {
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
      scheduleDayId: { //0 - вс, 1 - пн, ..., 6 - сб
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'WeekDays', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
      },
      scheduleStartTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      scheduleEndTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      scheduleStatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      scheduleServiceTypeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Services', // Имя модели, на которую ссылается внешний ключ
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
    await queryInterface.dropTable('Schedules');
  }
};