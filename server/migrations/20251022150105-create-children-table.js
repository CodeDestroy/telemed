'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Children', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      patronymicName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      snils: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      polis: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      docSeries: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      docNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Children');
  },
};
