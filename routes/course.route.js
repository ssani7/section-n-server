const express = require('express');
const router = express.Router()

const { getAllCourses, getCourse } = require('../controller/courses.controller')

router
    .get('/', getAllCourses)
    .get('/:semesterName', getCourse)

module.exports = router