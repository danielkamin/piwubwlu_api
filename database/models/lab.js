'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lab extends Model {
    static associate(models) {
      Lab.belongsTo(models.Department,{foreignKey:'departmentId'});
      Lab.hasMany(models.Workshop,{foreignKey:'labId'})
    }
  };
  Lab.init({
    name: DataTypes.STRING,
    english_name: DataTypes.STRING,
    imagePath:DataTypes.STRING,
    additionalInfo:DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Lab',
  });
  return Lab;
};