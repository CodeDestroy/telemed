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
     * const monday = await this.models.WeekDays.create({name: 'Понедельник', id: 1})
      const tuesday = await this.models.WeekDays.create({name: 'Вторник', id: 2})
      const wednesday = await this.models.WeekDays.create({name: 'Среда', id: 3})
      const thursday = await this.models.WeekDays.create({name: 'Четверг', id: 4})
      const friday = await this.models.WeekDays.create({name: 'Пятница', id: 5})
      const saturday = await this.models.WeekDays.create({name: 'Суббота', id: 6})
      const sunday = await this.models.WeekDays.create({name: 'Воскресенье', id: 0})
    */
    return queryInterface.bulkInsert('WeekDays', [
      {name: 'Понедельник', id: 1, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Вторник', id: 2, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Среда', id: 3, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Четверг', id: 4, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Пятница', id: 5, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Суббота', id: 6, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Воскресенье', id: 0, createdAt: new Date(), updatedAt: new Date()},
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('WeekDays', null, {});
  }
};
