'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MachineService extends Model {
    static associate(models) {
      MachineService.belongsTo(models.Machine,{foreignKey:'machineId'})
      MachineService.belongsTo(models.Employee,{foreignKey:'employeeId'})
    }
  };
  MachineService.init({
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'MachineService',
  });
  return MachineService;
};