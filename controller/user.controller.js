const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const { getDb } = require('../utils/dbConnect');

const db = getDb();
const userCollection = db?.collection("users")
const studentsCollection = db?.collection("students")

module.exports.assignUser = async (req, res) => {
    try {
        const user = req.body;
        const email = req.params.email;
        const updateDoc = {
            $set: user
        }
        const result = await userCollection.updateOne({ email }, updateDoc, { upsert: true });
        const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1d' });

        res.send({ result, token });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: error.message
        })
    }
}

module.exports.getUser = async (req, res) => {
    try {
        const email = req.params.email;
        const result = await userCollection.findOne({ email });
        res.send(result);
    } catch (error) {
        res.status(400).send({
            status: "failed",
            message: error.message
        })
    }
}

module.exports.updateUser = async (req, res) => {
    try {
        const _id = req.params.id;
        const studentId = req.params.studentId;
        const userData = req.body;
        delete userData?._id
        const verification = req.params.verification;
        const updateDoc = {
            $set: userData
        }

        const updateUser = await userCollection.updateOne({ _id: ObjectId(_id) }, updateDoc, { upsert: true });

        if (updateUser.modifiedCount > 0 && verification === "verified") {
            const student = await studentsCollection.findOne({ id: studentId });
            if (student?.userData) {
                for (var prop in userData) {
                    student.userData[prop] = userData[prop]
                }
            }
            const result = await studentsCollection.updateOne({ id: studentId }, {
                $set: {
                    userData: student.userData,
                    ...(userData.id) && { id: userData.id },
                },

            })
            return res.send(result)
        }
        else {
            return res.send(updateUser);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: error.message
        })
    }
}

// module.exports.deleteUser = async (req, res) => {
//     try {
//         const email = req.params.email;
//         const result = await userCollection.deleteOne({ email });
//         res.send(result)
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({
//             status: "failed",
//             message: error.message
//         })
//     }
// }

module.exports.getUserRole = async (req, res) => {
    const email = req.params.email;
    const user = await userCollection.findOne({ email });
    if (user?.role === "admin") {
        res.send(true);
    }
    else {
        res.send(false);
    }
}

module.exports.getAllStudents = async (req, res) => {
    try {
        const result = await studentsCollection.find().sort({ id: 1 }).toArray();
        res.send(result);
    } catch (error) {
        res.send(error)
    }
}

// ****** needs optimization ****
module.exports.updatePortfolio = async (req, res) => {
    const portfolio = req.body;
    const id = req.query.id;
    const verification = req.query.verification;
    const updateDoc = {
        $set: {
            portfolio: portfolio
        }
    }
    const result = await userCollection.updateOne({ _id: ObjectId(id) }, updateDoc, { upsert: true });

    if (result.modifiedCount = 0) {
        res.send({ error: "Nothing Updated" })
    }
    else if (verification !== "verified") {
        res.send({ error: "Not Verrified" });
    }
    else {
        const user = await userCollection.findOne({ _id: ObjectId(id), verification: "verified" });
        const updateStudent = {
            $set: {
                portfolio: portfolio
            }
        }
        const update = await studentsCollection.updateOne({ id: user.id }, updateStudent, { upsert: true });
        res.send(update);
    }
}

module.exports.verifyReqList = async (req, res) => {
    try {
        const result = await userCollection.find({ verification: "pending" }).toArray();
        res.send(result);
    } catch (error) {
        res.send(error)
    }
}

module.exports.getVerification = async (req, res) => {
    try {
        const userId = req.query.id;
        const userEmail = req.query.email;
        const idHolder = await studentsCollection.findOne({ id: userId });
        const existingUser = await userCollection.find({ id: userId, verification: "verified" }).toArray();
        const updateDoc = {
            $set: {
                verification: "pending",
                id: userId
            }
        }
        if (idHolder) {
            if (existingUser.length > 0) {
                res.send(existingUser);
            }
            else {
                const reqVerification = await userCollection.updateOne({ email: userEmail }, updateDoc, { upsert: true });
                res.send(reqVerification);
            }
        }
        else {
            res.send({ error: "id not matched" });
        }
    } catch (error) {
        res.send(error)
    }
}

module.exports.approveVerification = async (req, res) => {
    const id = req.params.id;
    const updateDoc = {
        $set: {
            verification: "verified"
        }
    }
    const result = await userCollection.updateOne({ _id: ObjectId(id) }, updateDoc, { upsert: true });
    if (result.modifiedCount > 0) {
        const user = await userCollection.findOne({ _id: ObjectId(id), verification: "verified" });
        const updateStudent = {
            $set: {
                userData: user
            }
        }
        const update = await studentsCollection.updateOne({ id: user.id }, updateStudent, { upsert: true })
        res.send(update);
    }
}