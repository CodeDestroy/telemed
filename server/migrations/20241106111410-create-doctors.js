'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Doctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      secondName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      patronomicName: {
        type: Sequelize.STRING
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      snils: {
        type: Sequelize.STRING,
        allowNull: false
      },
      medOrgId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MedicalOrgs', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
      },
      postId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts', // Имя модели, на которую ссылается внешний ключ
          key: 'id',
        }
        
      },
      info: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Doctors');
  }
};