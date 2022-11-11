'use strict';


const {
  Model
} = require('sequelize');
const bcryptjs = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Course, {foreignKey: 'InstructorId', as: 'InstructorCourses'})//Warning!!
      User.belongsToMany(models.Course, {
        through: models.UserCourse, as: 'StudentCourses'
      })
    }

    // static age(){
    //   let yearBirth = new Date(this.dateOfBirth).toLocaleString('id-ID', {year: 'numeric'})
    //   let yearNow = new Date().toLocaleString('id-ID', {year: 'numeric'})
    //   return Number(yearNow) - Number(yearBirth)
    // }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name must be filled'
        },
        notNull: {
          msg: 'Name must be filled'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'E-mail must be filled'
        },
        notNull: {
          msg: 'E-mail must be filled'
        },
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password must be filled'
        },
        notNull: {
          msg: 'Password must be filled'
        }
      }
    },
    role: DataTypes.STRING,
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Date Of Birth must be filled'
        },
        notNull: {
          msg: 'Date Of Birth must be filled'
        },
        isMinAge(value){
          if(!value){
            throw new Error('Date of birth required')
          } else {
            let today = new Date();
            let age = today.getFullYear() - value.getFullYear()
            if(age < 10){
              throw new Error('Age must be at least 10 years old')
            }
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user, options) => {
    const salt = bcryptjs.genSaltSync(10)
    const hash = bcryptjs.hashSync(user.password, salt)
    user.password = hash
  })

  return User;
};