'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Guest extends Model {
    
    static associate(models) {
      Guest.belongsTo(models.User,{foreignKey:'userId',onDelete:'CASCADE'})
    }
  };
  Guest.init({
    isVerified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Guest',
  });
  return Guest;
};