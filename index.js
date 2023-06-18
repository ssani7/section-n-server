const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { getUser, assignUser } = require('./controller/user.controller');
const { connectToServer } = require('./utils/dbConnect');
require('dotenv').config();
const port = process.env.PORT || 5000;

const userRoutes = require('./routes/user.route');
const eventRoutes = require('./routes/events.route');
const achievementRoutes = require('./routes/achievement.route');
const infoRoutes = require('./routes/info.route');
const courseRoutes = require('./routes/course.route');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kke0c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

connectToServer((err) => {
	if (!err) {
		app.listen(port, () => {
			console.log(`Listening to port ${port}`);
		});
	} else {
		console.log(err);
	}
});

const memesCollection = client.db('section-N').collection('memes');

// /user
app.use('/user', userRoutes);

// /routine
app.use('/routine', infoRoutes);

// students
app.use('/achievements', achievementRoutes);

// /events
app.use('/events', eventRoutes);

// /courses
app.use('/courses', courseRoutes);

// memes

app.post('/memes', async (req, res) => {
	const meme = req.body;
	const result = await memesCollection.insertOne(meme);
	res.send(result);
});

app.get('/', (req, res) => {
	res.send('Section n server running');
});

// gdrive

const gdriveRoutes = require('./routes/gdrive.route');

app.use(gdriveRoutes);
