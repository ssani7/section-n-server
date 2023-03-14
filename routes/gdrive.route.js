const express = require('express');
const multer = require('multer');
const path = require('path');
const { google } = require('googleapis')



const router = express.Router()
const upload = multer()

const KEYFILEPATH = path.join(__dirname, "../credentials.json")
const SCOPES = ["https://www.googleapis.com/auth/drive"]

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
})
const gdrive = google.drive({ version: "v3", auth });

router.get('/getSemesters', async (req, res) => {
    try {
        const { data } = await gdrive.files.list({
            q: `'${'1u-qIeQx-G1Lt3QTSSF4tpBh-KUfRsqHQ'}' in parents and trashed=false`,
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
            orderBy: 'name'
        })
        /*
        semesters = data.files
        const promises = [];
        semesters.map(async (semester, i) => {
            promises.push(gdrive.files.list({
                q: `'${semester.id}' in parents and trashed=false`,
                fields: 'nextPageToken, files(id, name)',
                spaces: 'drive',
            }))
        })
        const result = await Promise.all(promises)
        result.map((r, i) => {
            semesters[i] = { ...semesters[i], courses: r.data.files }
        }) 
        */
        res.send(data.files)

    } catch (error) {
        s
        res.send(error.message)
    }
})

router.get('/getCourses/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { data } = await gdrive.files.list({
            q: `'${id}' in parents and trashed=false`,
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
            orderBy: 'name'
        })
        res.send(data.files)

    } catch (error) {
        s
        res.send(error.message)
    }
})
router.get('/getSlides/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { data } = await gdrive.files.list({
            q: `'${id}' in parents and trashed=false`,
            fields: '*',
            spaces: 'drive',
            orderBy: 'name'
        })
        res.send(data.files)

    } catch (error) {
        res.send(error.message)
    }
})


module.exports = router