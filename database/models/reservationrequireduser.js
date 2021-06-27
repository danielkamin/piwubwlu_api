'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservationRequiredUser extends Model {  
    static associate(models) {
        ReservationRequiredUser.belongsTo(models.Reservation,{foreignKey:'reservationId',onDelete:'CASCADE'})
        ReservationRequiredUser.belongsTo(models.User,{foreignKey:'userId',onDelete:'SET NULL'})
    }
  };
  ReservationRequiredUser.init({
    name: DataTypes.STRING(100),
    userType:DataTypes.STRING(20)
  }, {
    sequelize,
    modelName: 'ReservationRequiredUser',
  });
  return ReservationRequiredUser;
};