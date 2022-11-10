'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
 up(queryInterface, Sequelize) {
    return queryInterface.createTable('CourseDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      CourseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Courses'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('CourseDetails');
  }
};