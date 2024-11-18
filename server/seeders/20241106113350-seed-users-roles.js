'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('UsersRoles', [
      { id: 1,roleName: 'Пациент', accessLevel: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2,roleName: 'Врач', accessLevel: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 3,roleName: 'Администратор', accessLevel: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, roleName: 'СуперАдминистратор', accessLevel: 4, createdAt: new Date(), updatedAt: new Date() }
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
