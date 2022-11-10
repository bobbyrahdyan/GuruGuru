'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CourseDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CourseDetail.belongsTo(models.Course)
    }
  }
  CourseDetail.init({
    description: DataTypes.STRING,
    CourseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CourseDetail',
  });
  return CourseDetail;
};