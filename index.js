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
const achievementRoutes = require('./routes/achievement.route')

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
const infoCollection = client.db("section-N").collection("info");
const memesCollection = client.db("section-N").collection("memes");

// /user
app.use('/user', userRoutes)

// /routine

app.get('/routine', async (req, res) => {
    const result = await infoCollection.findOne({ title: "routine" });
    res.send(result);
})

app.put('/routine', async (req, res) => {
    const routineData = req.body;
    const updateDoc = {
        $set: {
            routineData
        }
    }
    const result = await infoCollection.updateOne({ title: "routine" }, updateDoc, { upsert: true });
    res.send(result)
})

// students

app.use('/achievements', achievementRoutes)

// /students
app.get('/students', async (req, res) => {
    const result = await studentsCollection.find().sort({ id: 1 }).toArray();
    res.send(result);
})

// /events

app.get('/events', async (req, res) => {
    const result = await eventsCollection.find().toArray();
    res.send(result);
})

app.post('/events', async (req, res) => {
    const event = req.body;
    const result = await eventsCollection.insertOne(event);
    res.send(result);
})

// memes

app.post('/memes', async (req, res) => {
    const meme = req.body;
    const result = await memesCollection.insertOne(meme);
    res.send(result);
})

// portfolio data

app.post('/portfolio', async (req, res) => {
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
})

// admin features

app.get('/verifyReq', async (req, res) => {
    const result = await userCollection.find({ verification: "pending" }).toArray();
    res.send(result);
})

app.put("/verifyUser", async (req, res) => {
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

})

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

// /courses
app.get('/courses', async (req, res) => {
    const courses = await coursesCollection.find().toArray();
    res.send(courses);
})
app.get('/courses/:semesterName', async (req, res) => {
    const semesterName = req.params.semesterName;
    const result = await coursesCollection.findOne({ semester: semesterName });
    res.send(result);
})


app.get('/', (req, res) => {
    res.send('Section n server running')
})