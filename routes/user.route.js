const express = require('express');
const { getUser, assignUser, updateUser, deleteUser, getUserRole } = require('../controller/user.controller');

const router = express.Router();

router
    .put('/update/:id/:verification/:studentId', updateUser)
    .get('/role/:email', getUserRole)
// .delete('/:email', deleteUser)

router
    .get('/:email', getUser)
    .put('/:email', assignUser)

module.exports = router