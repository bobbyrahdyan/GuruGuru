const {User, Course, CourseDetail, UserCourse} = require('../models')

class Controller{
    static students(req, res){
        User.findAll({include: ['InstructorCourses', 'StudentCourses']})
        .then(courses => {
            res.send(courses)
            // res.render('studentHome', {courses})
        })
        .catch(err => res.send(err))
    }
}

module.exports = Controller;
