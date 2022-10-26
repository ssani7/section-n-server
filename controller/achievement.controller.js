const { getDb } = require('../utils/dbConnect')

// const startsCollection = client.db("section-N").collection("stars");
const startsCollection = getDb().collection("stars");


module.exports.getAchCount = async (req, res) => {
    try {
        const count = await startsCollection.countDocuments({ approved: true });
        res.send({ count });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: error.message
        })
    }

}

module.exports.getAchievements = async (req, res) => {
    try {
        const result = await startsCollection
            .find({ approved: true })
            .sort({ _id: -1 })
            .toArray();

        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: error.message
        })
    }

}

module.exports.getAchRequests = async (req, res) => {
    try {
        const result = await startsCollection
            .find({ approved: false })
            .sort({ _id: -1 })
            .toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: error.message
        })
    }

}

module.exports.postAchievement = async (req, res) => {
    try {
        const achievement = req.body;
        const result = await startsCollection.insertOne(achievement);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: error.message
        })
    }
}

module.exports.approveAch = async (req, res) => {
    try {
        const id = req.params;
        const updateDoc = {
            $set: {
                approved: true
            }
        }
        const result = await startsCollection.updateOne({ _id: ObjectId(id) }, updateDoc);
        res.send(result);

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: error.message
        })
    }

}

module.exports.declineAch = async (req, res) => {
    try {
        const id = req.params;
        const result = await startsCollection.deleteOne({ _id: ObjectId(id) });
        res.send(result);

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: error.message
        })
    }

}