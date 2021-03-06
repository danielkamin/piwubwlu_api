'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResetToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ResetToken.belongsTo(models.User,{foreignKey:'userId',onDelete:'CASCADE'})
    }
  };
  ResetToken.init({
    reset_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ResetToken',
  });
  return ResetToken;
};