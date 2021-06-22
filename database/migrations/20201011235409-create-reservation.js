'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reservations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.ENUM('FINISHED','PENDING','ACCEPTED','DECLINED','REVIEW')
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      sugestedState: {
        type: Sequelize.ENUM('ACCEPTED','DECLINED','CORRECT','INITIAL')
      },
      employeeId:{
        type: Sequelize.INTEGER,
        references: { model: 'Employees', key: 'id' },
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
    await queryInterface.dropTable('Reservations');
  }
};