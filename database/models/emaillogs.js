'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailLogs extends Model {
    static associate(models) {
      EmailLogs.belongsTo(models.Reservation,{foreignKey:'reservationId'})
    }
  };
  EmailLogs.init({
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'EmailLogs',
  });
  return EmailLogs;
};