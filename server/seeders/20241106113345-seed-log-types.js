'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('LogTypes', [
      { logTypeName: 'Системный лог', createdAt: new Date(), updatedAt: new Date() },
      { logTypeName: 'Платёжный лог', createdAt: new Date(), updatedAt: new Date() },
      { logTypeName: 'Лог слотов', createdAt: new Date(), updatedAt: new Date() },
      { logTypeName: 'Лог комнат', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('LogTypes', null, {});
  }
};
