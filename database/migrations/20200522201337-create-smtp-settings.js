'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SMTP_Settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user: {
        type: Sequelize.STRING
      },
      pass: {
        type: Sequelize.STRING
      },
      host: {
        type: Sequelize.STRING
      },
      requireTLS: {
        type: Sequelize.BOOLEAN
      },
      sequre: {
        type: Sequelize.BOOLEAN
      },
      port: {
        type: Sequelize.INTEGER
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SMTP_Settings');
  }
};