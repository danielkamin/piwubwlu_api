'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SMTP_Settings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SMTP_Settings.init({
    user: DataTypes.STRING,
    pass: DataTypes.STRING,
    host: DataTypes.STRING,
    requireTLS: DataTypes.BOOLEAN,
    sequre: DataTypes.BOOLEAN,
    port: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SMTP_Settings',
  });
  return SMTP_Settings;
};