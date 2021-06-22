'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Department,{foreignKey:'departmentId'})
      Employee.belongsTo(models.Degree,{foreignKey:'degreeId'})
      Employee.belongsTo(models.User,{foreignKey:'userId',onDelete:'CASCADE'})
      Employee.belongsToMany(models.Workshop,{through:'WorkshopSupervisors'})
      Employee.hasOne(models.Reservation,{foreignKey:'employeeId'})
      Employee.hasOne(models.MachineService,{foreignKey:'employeeId'})
      Employee.hasOne(models.DepartmentHead,{foreignKey:'employeeId'});
      Employee.hasOne(models.FacultyAuthorities,{foreignKey:'employeeId'})
      
    }
  };
  Employee.init({
    knowledgeBaseUrl: DataTypes.STRING,
    position:DataTypes.STRING,
    telephone:DataTypes.STRING,
    room:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};