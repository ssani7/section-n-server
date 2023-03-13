const { getDb } = require('../utils/dbConnect')

const eventsCollection = getDb().collection('events')

module.exports.getEvents = async (req, res) => {
    try {
        const result = await eventsCollection.find().toArray();
        res.send(result);
    } catch (error) {
        res.send(error)
    }
}

module.exports.postEvent = async (req, res) => {
    try {
        const event = req.body;
        const result = await eventsCollection.insertOne(event);
        res.send(result);
    } catch (error) {
        res.send(error)
    }
}