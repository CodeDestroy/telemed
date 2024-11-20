'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return Promise.all([
      queryInterface.addColumn(
        'UsersSettings', // table name
        'value', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
          comment: 'Значение'
        },
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('UsersSettings', 'value'),
    ]);
  }
};
