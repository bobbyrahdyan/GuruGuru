'use strict';
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const courses = JSON.parse(fs.readFileSync('./data/detailCourses.json', 'utf-8')).map(el => {
      return {...el, createdAt: new Date(), updatedAt: new Date()}
     })
     return queryInterface.bulkInsert('CourseDetails', courses)
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete('CourseDetails')
  }
};
