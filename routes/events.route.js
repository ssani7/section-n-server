const express = require('express');
const router = express.Router()

const { getEvents, postEvent } = require('../controller/events.controller')

router.route('/')
    .get(getEvents)
    .post(postEvent)

module.exports = router