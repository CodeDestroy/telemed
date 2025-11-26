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
    
    await queryInterface.addColumn('mkbDiagnoses', 'parent_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Id родителя',
    });
    await queryInterface.addColumn('mkbDiagnoses', 'level', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Уровень дерева',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('mkbDiagnoses', 'parent_id');
    await queryInterface.removeColumn('mkbDiagnoses', 'level');
  }
};
