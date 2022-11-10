const routes = require('express').Router();
const Controller = require('../controllers')

routes.get('/', Controller.students)

module.exports = routes;