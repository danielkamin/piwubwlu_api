'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservationHistoryChange extends Model {  
    static associate(models) {
        ReservationHistoryChange.belongsTo(models.Reservation,{foreignKey:'reservationId',onDelete:'CASCADE'})
        ReservationHistoryChange.belongsTo(models.User,{foreignKey:'userId',onDelete:'SET NULL'})
    }
  };
  ReservationHistoryChange.init({
    description: DataTypes.STRING(200)
  }, {
    sequelize,
    modelName: 'ReservationHistoryChange',
  });
  return ReservationHistoryChange;
};