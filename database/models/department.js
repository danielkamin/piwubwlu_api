'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Department.belongsTo(models.Employee,{foreignKey:'employeeId'});
      Department.hasMany(models.Employee,{foreignKey:'departmentId'})
      Department.hasMany(models.Lab,{foreignKey:'departmentId'})
    }
  };
  Department.init({
    name: DataTypes.STRING,
    english_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Department',
  });
  return Department;
};