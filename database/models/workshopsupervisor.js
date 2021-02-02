'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkshopSupervisor extends Model {
   
    static associate(models) {
      
    }
  };
  WorkshopSupervisor.init({
    EmployeeId: DataTypes.INTEGER,
    WorkshopId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'WorkshopSupervisor',
  });
  WorkshopSupervisor.removeAttribute('id')
  return WorkshopSupervisor;
};