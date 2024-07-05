const express = require('express');
const { getUniData } = require('../controller/hafiz.controller');
const router = express.Router();

router.get('/', getUniData);

module.exports = router;
