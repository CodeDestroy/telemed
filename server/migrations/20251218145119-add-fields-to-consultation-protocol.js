'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await Promise.all([
      queryInterface.addColumn('Protocols', 'anamnesis_disease', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'anamnesis_life', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'vaccination', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'allergy_anamnesis', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'epid_anamnesis', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'objective_data', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'goal', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'additional_data', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'treatment_before', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'examination_plan', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'treatment_recommendations', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('Protocols', 'follow_up', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await Promise.all([
      queryInterface.removeColumn('Protocols', 'anamnesis_disease'),
      queryInterface.removeColumn('Protocols', 'anamnesis_life'),
      queryInterface.removeColumn('Protocols', 'vaccination'),
      queryInterface.removeColumn('Protocols', 'allergy_anamnesis'),
      queryInterface.removeColumn('Protocols', 'epid_anamnesis'),
      queryInterface.removeColumn('Protocols', 'objective_data'),
      queryInterface.removeColumn('Protocols', 'goal'),
      queryInterface.removeColumn('Protocols', 'additional_data'),
      queryInterface.removeColumn('Protocols', 'treatment_before'),
      queryInterface.removeColumn('Protocols', 'examination_plan'),
      queryInterface.removeColumn('Protocols', 'treatment_recommendations'),
      queryInterface.removeColumn('Protocols', 'follow_up'),
    ]);
  }
};
