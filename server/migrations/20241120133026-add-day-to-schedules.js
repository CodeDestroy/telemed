'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /* await queryInterface.addColumn('Schedules', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      comment: 'Дата, если используем даты, а не дни недели',
    }); */
  },

  async down (queryInterface, Sequelize) {
    /* await queryInterface.removeColumn('Schedules', 'date'); */
  }
};