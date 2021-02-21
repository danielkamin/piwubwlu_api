'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Workshop extends Model {  
    static associate(models) {
      Workshop.belongsToMany(models.Employee,{through:'WorkshopSupervisors'})
      Workshop.belongsTo(models.Lab,{foreignKey:'labId'})
      Workshop.belongsTo(models.WorkshopType,{foreignKey:'typeId'})
      Workshop.hasMany(models.Machine,{foreignKey:'workshopId'})
    }
  };
  Workshop.init({
    name: DataTypes.STRING,
    english_name: DataTypes.STRING,
    room_number: DataTypes.STRING,
    imagePath:DataTypes.STRING,
    additionalInfo:DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'Workshop',
  });
  return Workshop;
};