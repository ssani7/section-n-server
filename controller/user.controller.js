const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const { getDb } = require('../utils/dbConnect');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kke0c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});


const eventsCollection = client.db("section-N").collection("events");
const coursesCollection = client.db("section-N").collection("courses");
const studentsCollection = client.db("section-N").collection("students");
const infoCollection = client.db("section-N").collection("info");
const memesCollection = client.db("section-N").collection("memes");

const db = getDb();
const userCollection = db?.collection("users")


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
        const user = req.body;
        delete user?._id
        const id = req.params.id;
        const studentId = req.params.studentId;
        const verification = req.params.verification;
        const updateDoc = {
            $set: user
        }

        const updateUser = await userCollection.updateOne({ _id: ObjectId(id) }, updateDoc, { upsert: true });

        if (updateUser.modifiedCount > 0 && verification === "verified") {
            const result = await studentsCollection.updateOne({ id: studentId }, {
                $set: {
                    userData: user
                }

            }, { upsert: true });
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