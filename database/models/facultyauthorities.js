'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FacultyAuthoritie extends Model {

    static associate(models) {
      FacultyAuthoritie.belongsTo(models.Employee,{foreignKey:'employeeId'})
    }
  };
  FacultyAuthoritie.init({
    type: DataTypes.ENUM('deputy_dean','dean'),
  }, {
    sequelize,
    modelName: 'FacultyAuthoritie',
  });
  return FacultyAuthoritie;
};