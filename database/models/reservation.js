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
      Reservation.hasOne(models.ReservationDeclineComment,{foreignKey:'reservationId',onDelete:'CASCADE'})
    }
  };
  Reservation.init({
    state: DataTypes.ENUM('FINISHED','PENDING','ACCEPTED','DECLINED'),
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};