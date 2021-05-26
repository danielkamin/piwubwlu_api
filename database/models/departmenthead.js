'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DepartmentHead extends Model {
    static associate(models) {
      DepartmentHead.belongsTo(models.Department,{foreignKey:'machineId'})
      DepartmentHead.belongsTo(models.Employee,{foreignKey:'employeeId'})
    }
  };
  DepartmentHead.init({
  }, {
    sequelize,
    modelName: 'DepartmentHead',
  });
  return DepartmentHead;
};