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
    const testUser1 = await database["Users"].findOne({
      where: {
          login: 'testPatient'
      },
    })
    const testUser2 = await database["Users"].findOne({
      where: {
          login: 'testPatient2'
      },
    })
    return queryInterface.bulkInsert('Patients', [
      { userId: testUser1.id, secondName: 'Пациентов', firstName: 'Пациент', patronomicName: 'Пациентович', birthDate: new Date(), info: 'Тестовый пациент', snils: '2', createdAt: new Date(), updatedAt: new Date() },
      { userId: testUser2.id, secondName: 'Иванов', firstName: 'Иван', patronomicName: 'Иванович', birthDate: new Date(), info: 'Тестовый пациент 2', snils: '3', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Patients', null, {});
  }
};
