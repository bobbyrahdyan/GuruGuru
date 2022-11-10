const {User, Course, CourseDetail, UserCourse} = require('../models')

class Controller{
    static students(req, res) {
        User.findAll({
            include: Course
        })
        .then(students => {
            res.send(students)
        })
        .catch(err => res.send(err))
    }
}

module.exports = Controller;
