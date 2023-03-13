const express = require('express');
const { getRoutine, updateRoutine } = require('../controller/info.controller')

const router = express.Router();

router.route('/')
    .get(getRoutine)
    .put(updateRoutine)

module.exports = router