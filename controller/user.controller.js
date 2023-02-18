const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const { getDb } = require('../utils/dbConnect');

const db = getDb();
const userCollection = db?.collection("users")
const studentsCollection = db?.collection("students")


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

module.exports.updateUser = async (req, res) => {
    try {
        const userData = req.body;
        delete userData?._id
        const _id = req.params.id;
        const studentId = req.params.studentId;
        const verification = req.params.verification;
        const updateDoc = {
            $set: userData
        }

        const updateUser = await userCollection.updateOne({ _id: ObjectId(_id) }, updateDoc, { upsert: true });

        if (updateUser.modifiedCount > 0 && verification === "verified") {

            const result = await studentsCollection.updateOne({ id: studentId }, {
                $set: {
                    userData: userData
                }

            }, { upsert: true });
            console.log(result);
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