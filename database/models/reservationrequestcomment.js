'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservationRequestComment extends Model {
    static associate(models) {
      ReservationRequestComment.belongsTo(models.Reservation,{foreignKey:'reservationId',onDelete:'CASCADE'})
    }
  };
  ReservationRequestComment.init({
    comment: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'ReservationRequestComment',
  });
  return ReservationRequestComment;
};