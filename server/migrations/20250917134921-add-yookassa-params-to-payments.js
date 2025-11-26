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

    await queryInterface.addColumn('Payments', 'yookassa_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Payments', 'yookassa_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Payments', 'yookassa_payment_method_type', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Payments', 'yookassa_id');
    await queryInterface.removeColumn('Payments', 'yookassa_status');
    await queryInterface.removeColumn('Payments', 'yookassa_payment_method_type');
  }
};
