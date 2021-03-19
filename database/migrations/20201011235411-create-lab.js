'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Labs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      english_name: {
        type: Sequelize.STRING
      },
      employeeId:{
        type: Sequelize.INTEGER,
        references: { model: 'Employees', key: 'id' },
        onDelete:'SET NULL'
      },
      additionalInfo:{
        type: Sequelize.TEXT
      },
      imagePath:{
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Labs');
  }
};