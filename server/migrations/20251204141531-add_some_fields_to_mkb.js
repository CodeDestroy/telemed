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
    await queryInterface.addColumn('mkbDiagnoses', 'parent_code', {
      type: Sequelize.STRING,
      allowNull: true

    })
    await queryInterface.addColumn('mkbDiagnoses', 'full_name', {
      type: Sequelize.TEXT,
      allowNull: true

    })
    
    await queryInterface.removeColumn('mkbDiagnoses', 'name');
    
    await queryInterface.addColumn('mkbDiagnoses', 'name', {
      type: Sequelize.TEXT,
      allowNull: false

    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('mkbDiagnoses', 'parent_code');
    await queryInterface.removeColumn('mkbDiagnoses', 'full_name');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
