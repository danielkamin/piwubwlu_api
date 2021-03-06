'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Machines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(60)
      },
      english_name: {
        type: Sequelize.STRING(60)
      },
      maxUnit: {
        type: Sequelize.INTEGER
      },
      timeUnit: {
        type: Sequelize.ENUM('15','30','45','60')
      },
      machineState:{
        type: Sequelize.BOOLEAN
      },
      additionalInfo:{
        type: Sequelize.JSONB
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      imagePath:{
        type: Sequelize.STRING
      },
      delayTime: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Machines');
  }
};