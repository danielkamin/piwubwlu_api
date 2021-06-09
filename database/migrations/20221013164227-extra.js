'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Machines','resourceType',{
        type: Sequelize.ENUM('MACHINE','SOFTWARE')
      })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Machines', 'resourceType')
  }
};
