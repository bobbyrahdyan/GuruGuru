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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name of Course is Required'
        }, 
        notEmpty: {
          msg: 'Name of Course is Required'
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Duration is Required'
        }, 
        notEmpty: {
          msg: 'Duration is Required'
        },
        min: {
          args: 1,
          msg: 'Duration Minimum is 1 Month'
        },
        max: {
          args: 6,
          msg: 'Duration Maximum is 6 Month'
        }
      }
    },
    InstructorId: DataTypes.INTEGER,
      
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price Course is Required'
        }, 
        notEmpty: {
          msg: 'Price of Course is Required'
        },
        min: {
          args: 100000,
          msg: 'Minimum Price is Rp 100.000'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};