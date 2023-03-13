const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { getUser, assignUser } = require('./controller/user.controller');
const { connectToServer } = require('./utils/dbConnect');
require('dotenv').config();
const port = process.env.PORT || 5000;

const userRoutes = require('./routes/user.route')
const eventRoutes = require('./routes/events.route')
const achievementRoutes = require('./routes/achievement.route')
const infoRoutes = require('./routes/info.route')
const courseRoutes = require('./routes/course.route')

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kke0c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

connectToServer((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Listening to port ${port}`);
        })
    }
    else {
        console.log(err);
    }
})

const userCollection = client.db("section-N").collection("users");
const startsCollection = client.db("section-N").collection("stars");
const eventsCollection = client.db("section-N").collection("events");
const coursesCollection = client.db("section-N").collection("courses");
const studentsCollection = client.db("section-N").collection("students");
const memesCollection = client.db("section-N").collection("memes");

// /user
app.use('/user', userRoutes)

// /routine
app.use('/routine', infoRoutes)

// students
app.use('/achievements', achievementRoutes)

// /events
app.use('/events', eventRoutes)

// /courses
app.use('/courses', courseRoutes)

app.put('/verification/approve/:id', async (req, res) => {
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
})

app.put('/verification/delete/:id', async (req, res) => {
    const id = req.params.id;
    const updateDoc = {
        $set: {
            verification: "unverified"
        }
    }
    const result = await userCollection.updateOne({ _id: ObjectId(id) }, updateDoc, { upsert: true });
    res.send(result)
})


// memes

app.post('/memes', async (req, res) => {
    const meme = req.body;
    const result = await memesCollection.insertOne(meme);
    res.send(result);
})


app.get('/', (req, res) => {
    res.send('Section n server running')
})