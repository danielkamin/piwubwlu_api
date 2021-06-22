'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservationComment extends Model {  
    static associate(models) {
      ReservationComment.belongsTo(models.Reservation,{foreignKey:'reservationId',onDelete:'CASCADE'})
      ReservationComment.belongsTo(models.User,{foreignKey:'userId',onDelete:'SET NULL'})
    }
  };
  ReservationComment.init({
    comment: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'ReservationComment',
  });
  return ReservationComment;
};