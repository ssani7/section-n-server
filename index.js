const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
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

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const result = await userCollection.findOne({ email });
            res.send(result);
        })

        app.put("/users/:email", async (req, res) => {
            const user = req.body;
            const email = req.params.email;
            const updateDoc = {
                $set: user
            }
            const result = userCollection.updateOne({ email }, updateDoc, { upsert: true });
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
            res.send({ result, token });
        })

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

        app.get('/achievements', async (req, res) => {
            const result = await startsCollection.find({ approved: true }).sort({ _id: -1 }).toArray();
            res.send(result);
        })

        app.get('/achievementCount', async (req, res) => {
            const count = await startsCollection.countDocuments();
            res.send({ count });
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

        app.delete('/achievements/:id', async (req, res) => {
            const id = req.params;
            const result = await startsCollection.deleteOne({ _id: ObjectId(id) });
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

        app.get('/events', async (req, res) => {
            const result = await eventsCollection.find().toArray();
            res.send(result);
        })

        app.post('/events', async (req, res) => {
            const event = req.body;
            const result = await eventsCollection.insertOne(event);
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