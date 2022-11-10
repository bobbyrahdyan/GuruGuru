const {User, Course, CourseDetail, UserCourse} = require('../models')
const {currencyFormat} = require('../helpers/formatters')
const { Op } = require('sequelize')
const bcryptjs = require('bcryptjs')

class Controller{
    static home(req, res){
        Course.findAll({include: 'Instructor'})
        .then(courses => {
            res.render('home', {courses, currencyFormat})
        })
        .catch(err => res.send(err))
    }

///Bang Booby

static register(req, res) {
    res.render('register')
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
    res.render('login');
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
          if(result.role === 'student'){
              res.redirect(`/students/${userid}`)
            }
          if(result.role === 'instructor'){
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

///end Bang Booby


    static students(req, res){
        const userid = +req.params.studentId;
        Course.findAll({include: 'Instructor'})
        .then(courses => {
            res.render('student-home', {courses, currencyFormat, userid})
        })
        .catch(err => res.send(err))
    }

    static detailCourse(req, res){
        let detail;
        CourseDetail.findByPk(+req.params.courseId)
        .then(res => {
            detail = res;
            return Course.findByPk(detail.CourseId, {include: 'Instructor'})
        })
        .then(course => {
            res.render('detail-course', {course, detail})
        })
        .catch(err => res.send(err))
    }

    static studentCourse(req, res){
        const userid = +req.params.studentId;
        User.findByPk(+req.params.studentId,{include: 'Student'})
        .then(res => {
            res.send(res)
        })
        .catch(err => res.send(err))
    }

    static instructors(req, res){
        const instructorId = +req.params.studentId;
        Course.findAll({where: {
            InstructorId: +req.params.instructorId
        }})
        .then(courses => {
            // res.send(courses)
            res.render('instructor-home', {courses, currencyFormat, instructorId})
        })
        .catch(err => res.send(err))
    }

    static addCourse(req, res){
        const instructorId = +req.params.instructorId;
        console.log(req.params);
        console.log(typeof instructorId);
        res.render('create-course', {instructorId})
    }

    static createCourse(req, res){
        const InstructorId = +req.params.instructorId;
        const {name, duration, description} = req.body;
        Course.create({name, duration, InstructorId})
        .then(_ => {
            console.log(InstructorId);
            res.redirect(`/instructors/${InstructorId}`)
        })
        .catch(err => res.send(err))
    }
}

module.exports = Controller;