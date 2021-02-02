'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WorkshopSupervisors', {
      EmployeeId: {
        type: Sequelize.INTEGER,
        references: { model: 'Employees', key: 'id' },
        onDelete: 'CASCADE',
      },
      WorkshopId: {
        type:Sequelize.INTEGER,
        references: { model: 'Workshops', key: 'id' },
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('WorkshopSupervisors');
  }
};