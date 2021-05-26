'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FacultyAuthorities extends Model {

    static associate(models) {
      FacultyAuthorities.belongsTo(models.Employee,{foreignKey:'employeeId'})
    }
  };
  FacultyAuthorities.init({
    type: DataTypes.ENUM('deputy_dean','dean'),
  }, {
    sequelize,
    modelName: 'FacultyAuthorities',
  });
  return FacultyAuthorities;
};