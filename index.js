const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { getUser, assignUser } = require('./controller/user.controller');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kke0c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const userCollection = client.db("section-N").collection("users");
        const startsCollection = client.db("section-N").collection("stars");
        const eventsCollection = client.db("section-N").collection("events");
        const coursesCollection = client.db("section-N").collection("courses");
        const studentsCollection = client.db("section-N").collection("students");
        const infoCollection = client.db("section-N").collection("info");
        const memesCollection = client.db("section-N").collection("memes");

        // /user

        app.get('/user/:email', getUser)

        app.put("/user/:email", assignUser)

        app.put("/user/update/:id/:verification/:studentId", async (req, res) => {
            const user = req.body;
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
                res.send(result)
            }
            else {
                res.send(updateUser);
            }
        })

        app.delete("/users/:email", async (req, res) => {
            const email = req.params.email;
            const result = await userCollection.deleteOne({ email });
            res.send(result)
        })


        // /
        app.get('/role/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email });
            if (user?.role === "admin") {
                res.send(true);
            }
            else {
                res.send(false);
            }
        })

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

        app.get('/achievementCount', async (req, res) => {
            const count = await startsCollection.countDocuments({ approved: true });
            res.send({ count });
        })

        app.get('/achievements', async (req, res) => {
            const result = await startsCollection.find({ approved: true }).sort({ _id: -1 }).toArray();
            res.send(result);
        })

        app.get('/achievementsReq', async (req, res) => {
            const result = await startsCollection.find({ approved: false }).sort({ _id: -1 }).toArray();
            res.send(result);
        })

        app.post('/achievements', async (req, res) => {
            const achievement = req.body;
            const result = await startsCollection.insertOne(achievement);
            res.send(result);
        })

        app.put('/achievements/:id', async (req, res) => {
            const id = req.params;
            const updateDoc = {
                $set: {
                    approved: true
                }
            }
            const result = await startsCollection.updateOne({ _id: ObjectId(id) }, updateDoc);
            res.send(result);
        })

        app.delete('/achievements/:id', async (req, res) => {
            const id = req.params;
            const result = await startsCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        })


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
    }

    finally {
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Section n server running')
})
app.listen(port, () => {
    console.log("Listeing to port", port);
})