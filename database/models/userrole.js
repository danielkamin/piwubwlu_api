'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {

    static associate(models) {
      // define association here
    }
  };
  UserRole.init({
    userId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserRole',
  });
  UserRole.removeAttribute('id')
  return UserRole;
};