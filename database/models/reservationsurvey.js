'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservationSurvey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReservationSurvey.belongsTo(models.Reservation,{foreignKey:'reservationId',onDelete:'CASCADE'})
    }
  };
  ReservationSurvey.init({
    comment: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'ReservationSurvey',
  });
  return ReservationSurvey;
};