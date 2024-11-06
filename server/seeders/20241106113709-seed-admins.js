'use strict';
const database = require('../models/index')
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
    const adminSuper = await database["Users"].findOne({
      where: {
          login: 'superAdmin'
      },
    })
    const healthyAdmin = await database["Users"].findOne({
      where: {
          login: 'admin'
      },
    })
    return queryInterface.bulkInsert('Admins', [
      { userId: healthyAdmin.id, secondName: 'Админов', firstName: 'Админ', patronomicName: 'Админович', birthDate: new Date(), info: 'Тестовый админ', medOrgId: 1, createdAt: new Date(), updatedAt: new Date() },
      { userId: adminSuper.id, secondName: 'Админов', firstName: 'Админ', patronomicName: 'Админович', birthDate: new Date(), info: 'Тестовый админ', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Admins', null, {});
  }
};
