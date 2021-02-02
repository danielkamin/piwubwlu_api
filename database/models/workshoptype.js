'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkshopType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WorkshopType.hasMany(models.Workshop,{foreignKey:'typeId'})
    }
  };
  WorkshopType.init({
    name: DataTypes.STRING,
    english_name: DataTypes.STRING,
    symbol: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WorkshopType',
  });
  return WorkshopType;
};