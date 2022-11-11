const {User, Course, CourseDetail, UserCourse} = require('../models')
const {currencyFormat} = require('../helpers/formatters')
const { Op } = require('sequelize')
const bcryptjs = require('bcryptjs')

class Controller{

    static home(req, res){
        const {search} = req.query
        let options = {}
        options.include = 'Instructor'
        if(search){
            options.where = {
                name: {
                    [Op.iLike]: `%${search}%`
                }
            }
        }
        Course.findAll(options)
        .then(courses => {
            res.render('home', {courses, currencyFormat})
        })
        .catch(err => res.send(err))
    }

    static detailCourse(req, res){
        const courseId = +req.params.courseId;
        let detail;
        CourseDetail.findByPk(courseId)
        .then(result => {
            detail = result;
            return Course.findByPk(detail.CourseId, {include: 'Instructor'})
        })
        .then(course => {
            // res.send(course)
            res.render('detail-course-public', {course, detail})
        })
        .catch(err => res.send(err))
    }


static register(req, res) {
    const {errors} = req.query
    res.render('register', {errors})
}

static createUserProfile(req, res) {
    const { name, email, password, role, dateOfBirth } = req.body;
    if (!name || !email || !password || !role || !dateOfBirth) {
      let errorProfile = 'Please enter name, email, password, role, or date of birth'
      res.redirect(`/register?err=${errorProfile}`)
    } else {
      User.create({ name, email, password, role, dateOfBirth })
        .then(() => {
          res.redirect(`/login`)
        })
        .catch(err => {
          let errors = err
          if (err.name == 'SequelizeValidationError') {
            errors = err.errors.map((ele) => ele.message)
          }
          res.redirect(`/register?err=${errors}`)
        })
    }
}

static login(req, res) {
    const {errors} = req.query
    res.render('login', {errors});
}

static redirectLogin(req, res) {
    const { email, password } = req.body
    let userid;
    User.findOne({
      where: {
        email: email
      }
    })
      .then(result => {
        let inputPw = password
        let dataPw = result.password
        let pwCheck = bcryptjs.compareSync(inputPw, dataPw)
        if (pwCheck === false) {
          //gagal login
          let errorPw = 'Password-Incorrect'
          return res.redirect(`/login?err=${errorPw}`)
        } else {
          //berhasil login
          // console.log(req.session);
          userid = result.id
          req.session.email = result.email
          if(result.role=== 'student'){
              res.redirect(`/students/${userid}`)
            } else if(result.role === 'instructor'){
              res.redirect(`/instructors/${userid}`)
          }
        }
      })
      .catch(err => {
        let errors = err
        if (err.name == 'SequelizeValidationError') {
          errors = err.errors.map(el => el.message)
        }
        res.redirect(`/login?err=${errors}`)
      })
}

static destroySession(req,res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    })
}


    static students(req, res){
        const studentId = +req.params.studentId;
        Course.findAll({include: 'Instructor'})
        .then(courses => {
            res.render('student-home', {courses, currencyFormat, studentId})
        })
        .catch(err => res.send(err))
    }

    static detailCourseStudent(req, res){
        const studentId = +req.params.studentId;
        let detail;
        CourseDetail.findByPk(+req.params.courseId)
        .then(res => {
            detail = res;
            return Course.findByPk(detail.CourseId, {include: 'Instructor'})
        })
        .then(course => {
            res.render('detail-course-std', {course, detail, studentId})
        })
        .catch(err => res.send(err))
    }

    static studentCourse(req, res){
        // Course.findAll()
        // .then(result => res.send(result))
        // .catch(err => res.send(err))
        const studentId = +req.params.studentId;
        User.findByPk(studentId, {include: 'StudentCourses'})
        .then(result => {
            res.send(result)
        })
        .catch(err => res.send(err))
    }

    static enrollCourse(req, res){
        const {studentId, courseId} = req.params
        // console.log(req.params)
        let CourseId;
        let UserId;

        // if(studentId && courseId){
        //     CourseId = courseId;
        //     UserId = studentId
        // }

        // UserCourse.create({CourseId, UserId})
        // .then(_ => res.redirect(`/students/${studentId}?success=enrolled`))
        // .catch(err => res.send(err))

        UserCourse.findAll({where: {
            UserId: studentId,
            CourseId: courseId
        }})
        .then(result => {
            if(result.length !== 0){
                return res.redirect(`/students/${studentId}?errors`)
            } else{
                return UserCourse.create({studentId, courseId})
                .then(_ => {
                    res.redirect(`/students/${studentId}?success=enrolled`)
                })
                .catch(err => res.send(err))
            }
        })
        .catch(err => res.send(err))
        
    }

    static instructors(req, res){
        const courseId = +req.params.courseId
        console.log(req.params, 'ini courseId');
        const instructorId = +req.params.instructorId;
        console.log(req.params, 'yohoooooo');
        Course.findAll({where: {
            InstructorId: +req.params.instructorId
        }})
        .then(courses => {
            res.render('instructor-home', {courses, currencyFormat, instructorId, courseId})
        })
        .catch(err => res.send(err))
    }

    static detailCourseIns(req, res){
        const instructorId = +req.params.instructorId
        let detail;
        CourseDetail.findByPk(+req.params.courseId)
        .then(result => {
            detail = result;
            return Course.findByPk(detail.CourseId, {include: 'Instructor'})
        })
        .then(course => {
            res.render('detail-course-ins', {course, detail, instructorId})
        })
        .catch(err => res.send(err))
    }

    static addCourse(req, res){
        const {errors} = req.query
        const instructorId = +req.params.instructorId;
        res.render('create-course', {instructorId, errors})
    }

    static createCourse(req, res){
        const InstructorId = +req.params.instructorId;
        const {name, duration, price, description} = req.body;
        Course.create({name, duration, InstructorId, price})
        .then(course => {
            const CourseId = course.id
            return CourseDetail.create({description, CourseId})
        })
        .then(_ => {
            res.redirect(`/instructors/${InstructorId}`)
        })
        .catch(err => {
            if(err.name === 'SequelizeValidationError'){
                const errors = err.errors.map(el => el.message)
                res.redirect(`/instructors/${InstructorId}/add?errors=${errors}`)
            } else {
                res.send(err)
            }
        })
    }

    static delete(req, res){
        const courseId = +req.params.courseId
        CourseDetail.destroy({where: {
            id: courseId
        }})
        .then(_ => {
            return Course.destroy({where: {
                id: courseId
            }})
        })
        .then(_ => {
            res.redirect(`/instructors/${+req.params.instructorId}`)
        })
        .catch(err => res.send(err))
    }

    static editCourse(req, res){
        const {errors} = req.query
        const instructorId = +req.params.instructorId
        let course;
        Course.findByPk(+req.params.courseId)
        .then(result => {
            course = result;
            return CourseDetail.findByPk(+req.params.courseId)
        })
        .then(description => {
            res.render('edit-course', {course, description, instructorId, errors})
        })
        .catch(err => res.send(err))
    }

    static updateCourse(req, res){
        const {name, duration, price, description} = req.body
        console.log(req.body);
        const courseId = +req.params.courseId
        console.log(req.params);
        const InstructorId = +req.params.instructorId
        Course.update({name, duration, price}, {where: {
            id: courseId
        }})
        .then(_ => {
            return CourseDetail.update({description, courseId}, {where: {
                id: courseId
            }})
        })
        .then(_ => {
            res.redirect(`/instructors/${InstructorId}`)
        })
        .catch(err => {
            if(err.name === 'SequelizeValidationError'){
                const errors = err.errors.map(el => el.message)
                res.redirect(`/instructors/${InstructorId}/edit/${courseId}?errors=${errors}`)
            } else {
                res.send(err)
            }
        })
    }

    static getListStudents(req, res){
        const instructorId = +req.params.instructorId;
        User.findAll({where: {
            role: 'student'
        }})
        .then(students => {
            // res.send(students)
            res.render('list-students', {students, instructorId})
        })
        .catch(err => res.send(err))
    }
}

module.exports = Controller;