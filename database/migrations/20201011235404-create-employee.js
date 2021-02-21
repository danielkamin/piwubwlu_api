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
        type: Sequelize.STRING
      },
      title:{
        type:Sequelize.ARRAY(Sequelize.ENUM('inż.','mgr','dr','prof.','hab.'))
      },
      position:{
        type:Sequelize.STRING
      },
      telephone:{
        type:Sequelize.STRING
      },
      room:{
        type:Sequelize.STRING
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