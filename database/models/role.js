'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {    
    static associate(models) {
      Role.belongsToMany(models.User,{through:'UserRoles'})
    }
  };
  Role.init({
    role_name: DataTypes.STRING(20),
    description:DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};