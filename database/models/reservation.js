'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.Machine,{foreignKey:'machineId'})
      Reservation.belongsTo(models.Employee,{foreignKey:'employeeId'})
      Reservation.hasOne(models.ReservationSurvey,{foreignKey:'reservationId',onDelete:'CASCADE'})
      Reservation.hasMany(models.ReservationComment,{foreignKey:'reservationId',onDelete:'CASCADE'})
      Reservation.hasOne(models.EmailLogs,{foreignKey:'reservationId'})
    }
  };
  Reservation.init({
    state: DataTypes.STRING,
    sugestedState:DataTypes.STRING,
    reservationPurpose:DataTypes.ENUM('SCIENTIFIC','DIDACTIC','COMMERCIAL'),
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};