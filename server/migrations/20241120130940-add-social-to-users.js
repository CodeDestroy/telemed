'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'tgNick', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
          comment: 'Никнейм в ТГ'
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'hasWhatsApp', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          comment: 'Есть ли WhatsApp по номеру телефона'
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'hasVkSpherum', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          comment: 'Есть ли Сферум по номеру телефона'
        },
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'tgNick'),
      queryInterface.removeColumn('Users', 'hasWhatsApp'),
      queryInterface.removeColumn('Users', 'hasVkSpherum'),
    ]);
  }
};
