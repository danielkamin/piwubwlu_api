'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Machine extends Model {
    static associate(models) {
      Machine.belongsTo(models.Workshop,{foreignKey:'workshopId'})
      Machine.hasOne(models.Reservation,{foreignKey:'machineId'});
    }
  };
  Machine.init({
    name: DataTypes.STRING,
    english_name: DataTypes.STRING,
    timeUnit: DataTypes.ENUM('15','30','45','60'),
    maxUnit:DataTypes.INTEGER,
    machineState: DataTypes.BOOLEAN,
    imagePath:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Machine',
  });
  return Machine;
};