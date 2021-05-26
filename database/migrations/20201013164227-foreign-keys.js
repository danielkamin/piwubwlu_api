'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Employees','userId',{
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    }),
    await queryInterface.addColumn('Employees','degreeId',{
      type: Sequelize.INTEGER,
      references: { model: 'Degrees', key: 'id' },
      onDelete: 'SET NULL',
    })
    await queryInterface.addColumn('Workshops','labId',{
      type: Sequelize.INTEGER,
      references: { model: 'Labs', key: 'id' },
      onDelete:'SET NULL'
    }),
    await queryInterface.addColumn('ReservationSurveys','reservationId',{
      type: Sequelize.INTEGER,
      references: { model: 'Reservations', key: 'id' },
      onDelete: 'CASCADE',
    }),
    await queryInterface.addColumn('ResetTokens','userId',{
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    }),
    await queryInterface.addColumn('Reservations','machineId',{
      type: Sequelize.INTEGER,
      references: { model: 'Machines', key: 'id' },
      onDelete:'SET NULL'
    }),
    await queryInterface.addColumn('Guests','userId',{
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    }),
    await queryInterface.addColumn('UserRoles','userId',{
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    }),
    await queryInterface.addColumn('UserRoles','roleId',{
      type: Sequelize.INTEGER,
      references: { model: 'Roles', key: 'id' },
      onDelete: 'CASCADE',
    })
    await queryInterface.addColumn('Machines','workshopId',{
      type: Sequelize.INTEGER,
      references: { model: 'Workshops', key: 'id' },
      onDelete: 'SET NULL',
    })
    await queryInterface.addColumn('ReservationDeclineComments','reservationId',{
      type: Sequelize.INTEGER,
      references: { model: 'Reservations', key: 'id' },
      onDelete: 'CASCADE',
    }),
    await queryInterface.addColumn('ReservationRequestComments','reservationId',{
      type: Sequelize.INTEGER,
      references: { model: 'Reservations', key: 'id' },
      onDelete: 'CASCADE',
    }),
    await queryInterface.addColumn('Labs','departmentId',{
      type: Sequelize.INTEGER,
      references: { model: 'Departments', key: 'id' },
      onDelete: 'SET NULL',
    }),
    await queryInterface.addColumn('MachineServices','machineId',{
      type: Sequelize.INTEGER,
      references: { model: 'Machines', key: 'id' },
      onDelete:'SET NULL'
    }),
    await queryInterface.addColumn('MachineServices','employeeId',{
      type: Sequelize.INTEGER,
      references: { model: 'Employees', key: 'id' },
      onDelete:'SET NULL'
    }),
    await queryInterface.addColumn('DepartmentHeads','departmentId',{
      type: Sequelize.INTEGER,
      references: { model: 'Departments', key: 'id' },
      onDelete:'CASCADE'
    }),
    await queryInterface.addColumn('DepartmentHeads','employeeId',{
      type: Sequelize.INTEGER,
      references: { model: 'Employees', key: 'id' },
      onDelete:'SET NULL'
    })
    await queryInterface.addColumn('FacultyAuthorities','employeeId',{
      type: Sequelize.INTEGER,
      references: { model: 'Employees', key: 'id' },
      onDelete:'CASCADE'
    })
    await queryInterface.addColumn('EmailLogs','reservationId',{
      type: Sequelize.INTEGER,
      references: { model: 'Reservations', key: 'id' },
      onDelete:'SET NULL'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Employees', 'userId'),
    await queryInterface.removeColumn('Employees', 'degreeId'),
    await queryInterface.removeColumn('Workshops', 'labId'),
    await queryInterface.removeColumn('ReservationSurveys', 'reservationId'),
    await queryInterface.removeColumn('ResetTokens', 'userId'),
    await queryInterface.removeColumn('Reservations', 'machineId'),
    await queryInterface.removeColumn('Guests', 'userId'),
    await queryInterface.removeColumn('UserRoles', 'userId'),
    await queryInterface.removeColumn('UserRoles', 'roleId'),
    await queryInterface.removeColumn('Machines', 'workshopId')
    await queryInterface.removeColumn('ReservationDeclineComments','reservationId'),
    await queryInterface.removeColumn('ReservationRequestComments','reservationId'),
    await queryInterface.removeColumn('Labs', 'departmentId'),
    await queryInterface.removeColumn('MachineServices', 'machineId')
    await queryInterface.removeColumn('MachineServices', 'employeeId')
    await queryInterface.removeColumn('DepartmentHeads', 'departmentId')
    await queryInterface.removeColumn('DepartmentHeads', 'employeeId')
    await queryInterface.removeColumn('FacultyAuthorities', 'employeeId')
    await queryInterface.removeColumn('EmailLogs', 'reservationId')
  }
};
