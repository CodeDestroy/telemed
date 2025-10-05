'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Attachments', 'hash', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'MD5-хэш файла для проверки дубликатов',
    });

    // Для ускорения поиска дубликатов
    await queryInterface.addIndex('Attachments', ['hash'], {
      name: 'attachments_hash_idx',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex('Attachments', 'attachments_hash_idx');
    await queryInterface.removeColumn('Attachments', 'hash');
  }
};
