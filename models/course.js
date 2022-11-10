'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Course.belongsTo(models.User, {foreignKey: 'InstructorId', as: 'Instructor'})//Warning!!!
      Course.hasOne(models.CourseDetail)
      Course.belongsToMany(models.User, {
        through: models.UserCourse, as: 'Student'
      })
    }

    durationFormat(){
      return this.duration + " Bulan"
    }

  }
  Course.init({
    name: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    InstructorId: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};