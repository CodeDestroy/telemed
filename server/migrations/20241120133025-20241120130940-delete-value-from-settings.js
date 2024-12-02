'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Settings', 'settingValue'),
    ]);
  },
  /* settingValue: {
        type: Sequelize.TEXT,
        allowNull: false
      }, */

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Settings', // table name
        'settingValue', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: 'Значение'
        },
      ),
    ]);
  }
};
