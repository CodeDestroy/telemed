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
    return queryInterface.bulkInsert('PayTypes', [
      { payTypeName: 'Бесплатно', createdAt: new Date(), updatedAt: new Date() },
      { payTypeName: 'Подписка', createdAt: new Date(), updatedAt: new Date() },
      { payTypeName: 'Единовременная', createdAt: new Date(), updatedAt: new Date() },
      { payTypeName: 'Льготная', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('PayTypes', null, {});
  }
};
