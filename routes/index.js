const routes = require('express').Router();
const Controller = require('../controllers')

routes.get('/', Controller.home)
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
routes.get('/students/:studentId/detail/:courseId', Controller.detailCourse)
routes.get('/students/:studentId/courses', Controller.studentCourse)
routes.get('/instructors/:instructorId', Controller.instructors)
routes.get('/instructors/:instructorId/detail/:courseId', Controller.detailCourse)
routes.get('/instructors/:instructorId/add', Controller.addCourse)

module.exports = routes;