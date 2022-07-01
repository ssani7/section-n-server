const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        // app.get("/users", async (req, res) => {
        //     const cursor = userCollection.find({});
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        app.put("/users/:email", async (req, res) => {
            const user = req.body;
            const email = req.params.email;
            const updateDoc = {
                $set: user
            }
            const result = userCollection.updateOne({ email }, updateDoc, { upsert: true });
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