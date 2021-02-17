'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Role,{through:'UserRoles'})
      User.hasOne(models.Guest,{foreignKey:'userId',onDelete:'CASCADE'})
      User.hasOne(models.Employee,{foreignKey:'userId',onDelete:'CASCADE'})
    }
  };
  User.init({
    userType: DataTypes.STRING,
    email:DataTypes.STRING,
    firstName:DataTypes.STRING,
    lastName:DataTypes.STRING,
    password:DataTypes.STRING,
    picturePath:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};