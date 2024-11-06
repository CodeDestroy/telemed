'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('UsersRoles', [
      { roleName: 'СуперАдминистратор', accessLevel: 4, createdAt: new Date(), updatedAt: new Date() },
      { roleName: 'Администратор', accessLevel: 3, createdAt: new Date(), updatedAt: new Date() },
      { roleName: 'Врач', accessLevel: 2, createdAt: new Date(), updatedAt: new Date() },
      { roleName: 'Пациент', accessLevel: 1, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('UsersRoles', null, {});
  }
};
