'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reservations','sugestedState',{
      type: Sequelize.ENUM('ACCEPTED','DECLINED','CORRECT','INITIAL')
      })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reservations', 'sugestedState')
  }
};
