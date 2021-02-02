'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Department,{foreignKey:'departmentId'})
      Employee.belongsTo(models.User,{foreignKey:'userId',onDelete:'CASCADE'})
      Employee.belongsToMany(models.Workshop,{through:'WorkshopSupervisors'})
      Employee.hasOne(models.Lab,{foreignKey:'employeeId'})
      Employee.hasOne(models.Reservation,{foreignKey:'employeeId'})
    }
  };
  Employee.init({
    information: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};