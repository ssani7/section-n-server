const express = require('express');
const { getAchCount, getAchievements, getAchRequests, postAchievement, approveAch, declineAch } = require('../controller/achievement.controller');
const router = express.Router();


router.route('/')
    .get(getAchievements)
    .post(postAchievement)

router
    .get('/requests', getAchRequests)
    .get('/count', getAchCount)
    .put('/:id', approveAch)
    .delete('/:id', declineAch)


module.exports = router