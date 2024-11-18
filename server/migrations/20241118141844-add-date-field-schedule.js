'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Schedules', // table name
        'date', // new field name
        {
          type: Sequelize.DATEONLY,
          allowNull: true,
          comment: 'Дата, если используем даты, а не дни недели'
        },
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Schedules', 'date')
    ]);
  }
};
