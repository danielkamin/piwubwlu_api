'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservationDeclineComment extends Model {  
    static associate(models) {
      ReservationDeclineComment.belongsTo(models.Reservation,{foreignKey:'reservationId',onDelete:'CASCADE'})
    }
  };
  ReservationDeclineComment.init({
    comment: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'ReservationDeclineComment',
  });
  return ReservationDeclineComment;
};