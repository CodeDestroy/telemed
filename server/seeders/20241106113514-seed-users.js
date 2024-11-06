'use strict';
const bcrypt = require('bcryptjs');
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
    const hashPassword = bcrypt.hashSync('test', 8);
    const adminHashPassword = bcrypt.hashSync('admin', 8);
    const superAdmin = await database["UsersRoles"].findOne({
      where: {
          roleName: 'СуперАдминистратор'
      },
    })
    const admin = await database["UsersRoles"].findOne({
      where: {
        roleName: 'Администратор'
      },
    })
    const doc = await database["UsersRoles"].findOne({
      where: {
        roleName: 'Врач'
      },
    })
    const pat = await database["UsersRoles"].findOne({
      where: {
        roleName: 'Пациент'
      },
    })
    return queryInterface.bulkInsert('Users', [
      { login: 'testDoctor', password: hashPassword, userRoleId: doc.id, phone: '01', email: 'andrey.novichihin1@gmail.com', createdAt: new Date(), updatedAt: new Date() },
      
      { login: 'testPatient', password: hashPassword, userRoleId: pat.id, phone: '03', email: 'andrei_novichihin@mail.ru', createdAt: new Date(), updatedAt: new Date() },
      { login: 'testPatient2', password: hashPassword, userRoleId: pat.id, phone: '04', createdAt: new Date(), updatedAt: new Date() },
      { login: 'admin', password: adminHashPassword, userRoleId: admin.id, phone: '05', createdAt: new Date(), updatedAt: new Date() },
      { login: 'superAdmin', password: adminHashPassword, userRoleId: superAdmin.id, phone: '0', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
