const routes = require('express').Router();
const Controller = require('../controllers')

routes.get('/', Controller.home)
routes.get('/detail/:courseId', Controller.detailCourse)
routes.get('/register', Controller.register)
routes.post('/register', Controller.createUserProfile)
routes.get('/login', Controller.login)
routes.post('/login', Controller.redirectLogin)

routes.use((req, res, next) => {
    console.log(req.session);
    if (!req.session.email) {
        const error = 'Please Login First'
        res.redirect(`/login?err=${error}`)
    } else {
        next()
    }
})

routes.get('/logout', Controller.destroySession)


routes.get('/students/:studentId/', Controller.students)
routes.get('/students/:studentId/courses', Controller.studentCourse)
routes.get('/students/:studentId/enroll/:coursedId', Controller.enrollCourse)
routes.get('/students/:studentId/detail/:courseId', Controller.detailCourseStudent)


routes.get('/instructors/:instructorId', Controller.instructors)
routes.get('/instructors/:instructorId/detail/:courseId', Controller.detailCourseIns)
routes.get('/instructors/:instructorId/list', Controller.getListStudents)
routes.get('/instructors/:instructorId/add', Controller.addCourse)
routes.post('/instructors/:instructorId/add', Controller.createCourse)
routes.get('/instructors/:instructorId/delete/:courseId', Controller.delete)
routes.get('/instructors/:instructorId/edit/:courseId', Controller.editCourse)
routes.post('/instructors/:instructorId/edit/:courseId', Controller.updateCourse)

module.exports = routes;