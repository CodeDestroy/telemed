'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /* settingName: DataTypes.STRING,
    settingValue: DataTypes.TEXT,
    settingType: DataTypes.STRING */
    return queryInterface.bulkInsert('Settings', [
      {settingName: 'Отправлять уведомления в Telegram',  settingType: 'socialSettings', createdAt: new Date(), updatedAt: new Date()},
      
      {settingName: 'Отправлять уведомления в WhatsApp',  settingType: 'socialSettings', createdAt: new Date(), updatedAt: new Date()},
      
      {settingName: 'Отправлять уведомления в Сферум',  settingType: 'socialSettings', createdAt: new Date(), updatedAt: new Date()},
      
      {settingName: 'Темная тема',  settingType: 'viewSettings', createdAt: new Date(), updatedAt: new Date()},
      
      {settingName: 'Расписание по датам',  settingType: 'scheduleSettings', createdAt: new Date(), updatedAt: new Date()},
      
      {settingName: 'Закрыть свободные слоты',  settingType: 'scheduleSettings', createdAt: new Date(), updatedAt: new Date()},
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Settings', null, {});
  }
};
