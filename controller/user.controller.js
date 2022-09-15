const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kke0c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

const userCollection = client.db("section-N").collection("users");
const startsCollection = client.db("section-N").collection("stars");
const eventsCollection = client.db("section-N").collection("events");
const coursesCollection = client.db("section-N").collection("courses");
const studentsCollection = client.db("section-N").collection("students");
const infoCollection = client.db("section-N").collection("info");
const memesCollection = client.db("section-N").collection("memes");

module.exports.getUser = async (req, res) => {
    const email = req.params.email;
    const result = await userCollection.findOne({ email });
    res.send(result);
}

module.exports.assignUser = async (req, res) => {
    const user = req.body;
    const email = req.params.email;
    const updateDoc = {
        $set: user
    }
    const result = await userCollection.updateOne({ email }, updateDoc, { upsert: true });
    const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
    res.send({ result, token });
}