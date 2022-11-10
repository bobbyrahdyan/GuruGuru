'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserCourse.init({
    CourseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Course must be filled'
        },
        notNull: {
          msg: 'Course must be filled'
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'User must be filled'
        },
        notNull: {
          msg: 'User must be filled'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'UserCourse',
  });
  return UserCourse;
};