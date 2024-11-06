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
    return queryInterface.bulkInsert('SlotStatuses', [
      { slotStatusName: 'Свободно', createdAt: new Date(), updatedAt: new Date() },
      { slotStatusName: 'Ждёт оплаты', createdAt: new Date(), updatedAt: new Date() },
      { slotStatusName: 'Оплачено', createdAt: new Date(), updatedAt: new Date() },
      { slotStatusName: 'Завершено', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('SlotStatuses', null, {});
  }
};
