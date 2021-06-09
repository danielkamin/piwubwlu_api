'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reservations','reservationPurpose',{
        type: Sequelize.ENUM('SCIENTIFIC','DIDACTIC','COMMERCIAL')
      })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reservations', 'reservationPurpose')
  }
};
