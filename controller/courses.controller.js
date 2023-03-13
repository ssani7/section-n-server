const { getDb } = require('../utils/dbConnect')

const courseCollection = getDb().collection('courses')

module.exports.getAllCourses = async (req, res) => {
    try {
        const courses = await courseCollection.find().toArray();
        res.send(courses);
    } catch (error) {
        res.send(error)
    }
}

module.exports.getCourse = async (req, res) => {
    try {
        const semesterName = req.params.semesterName;
        const result = (semesterName === "current")
            ? await courseCollection.findOne({}, { sort: { _id: -1 }, limit: 1 })
            : await courseCollection.findOne({ semester: semesterName });
        res.send(result);
    } catch (error) {
        res.send(error)
    }
}