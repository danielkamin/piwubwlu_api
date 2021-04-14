'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      departmentId: {
        type: Sequelize.INTEGER,
        references: { model: 'Departments', key: 'id' },
        onDelete:'SET NULL'
      },
      information: {
        type: Sequelize.TEXT
      },
      position:{
        type:Sequelize.STRING(20)
      },
      telephone:{
        type:Sequelize.STRING(15)
      },
      room:{
        type:Sequelize.STRING(15)
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
    await queryInterface.dropTable('Employees');
  }
};