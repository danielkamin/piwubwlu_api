'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Employees','userId',{
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    }),
    queryInterface.addColumn('Workshops','labId',{
      type: Sequelize.INTEGER,
      references: { model: 'Labs', key: 'id' },
      onDelete:'SET NULL'
    }),
    queryInterface.addColumn('ReservationSurveys','reservationId',{
      type: Sequelize.INTEGER,
      references: { model: 'Reservations', key: 'id' },
      onDelete: 'CASCADE',
    }),
    queryInterface.addColumn('ResetTokens','userId',{
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    }),
    queryInterface.addColumn('Reservations','machineId',{
      type: Sequelize.INTEGER,
      references: { model: 'Machines', key: 'id' },
      onDelete:'SET NULL'
    }),
    queryInterface.addColumn('Guests','userId',{
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    }),
    queryInterface.addColumn('UserRoles','userId',{
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    }),
    queryInterface.addColumn('UserRoles','roleId',{
      type: Sequelize.INTEGER,
      references: { model: 'Roles', key: 'id' },
      onDelete: 'CASCADE',
    })
    queryInterface.addColumn('Machines','workshopId',{
      type: Sequelize.INTEGER,
      references: { model: 'Workshops', key: 'id' },
      onDelete: 'SET NULL',
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Employees', 'userId'),
      queryInterface.removeColumn('Workshops', 'labId'),
      queryInterface.removeColumn('ReservationSurveys', 'reservationId'),
      queryInterface.removeColumn('ResetTokens', 'userId'),
      queryInterface.removeColumn('Reservations', 'machineId'),
      queryInterface.removeColumn('Guests', 'userId'),
      queryInterface.removeColumn('UserRoles', 'userId'),
      queryInterface.removeColumn('UserRoles', 'roleId'),
      queryInterface.removeColumn('Machines', 'workshopId')
  }
};
