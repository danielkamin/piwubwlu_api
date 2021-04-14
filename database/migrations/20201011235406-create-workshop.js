'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Workshops', {
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
      room_number: {
        type: Sequelize.STRING(15)
      },
      additionalInfo:{
        type:Sequelize.TEXT
      },
      typeId:{
        type: Sequelize.INTEGER,
        references: { model: 'WorkshopTypes', key: 'id' },
        onDelete:'SET NULL'
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
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Workshops');
  }
};