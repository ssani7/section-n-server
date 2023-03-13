const { getDb } = require('../utils/dbConnect')

const infoCollection = getDb().collection("info");

module.exports.getRoutine = async (req, res) => {
    try {
        const result = await infoCollection.findOne({ title: "routine" });
        res.send(result);
    } catch (error) {
        res.send(error.message)
    }

}

module.exports.updateRoutine = async (req, res) => {
    const routineData = req.body;
    const updateDoc = {
        $set: {
            routineData
        }
    }
    const result = await infoCollection.updateOne({ title: "routine" }, updateDoc, { upsert: true });
    res.send(result)
}