const express = require('express');
const { getUser, assignUser, updateUser, deleteUser, getUserRole, getAllStudents, updatePortfolio, verifyReqList, verifyRequest, approveVerification, rejectVerification, getStudent } = require('../controller/user.controller');

const router = express.Router();

router
    .put('/update/:id/:verification/:studentId', updateUser)
    .get('/role/:email', getUserRole)
// .delete('/:email', deleteUser)

router
    .get('/students', getAllStudents)
    .get('/student/:id', getStudent)
    .post('/portfolio/update', updatePortfolio)

router
    .get('/verificationList', verifyReqList)
    .put('/verify', verifyRequest)
    .put('/verification/approve/:id', approveVerification)
    .put('/verification/reject/:id', rejectVerification)

router
    .get('/:email', getUser)
    .put('/:email', assignUser)



module.exports = router