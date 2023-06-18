const express = require('express');
const multer = require('multer');
const path = require('path');
const { google } = require('googleapis');

const router = express.Router();
const upload = multer();

const KEYFILEPATH = path.join(__dirname, '../credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
	keyFile: KEYFILEPATH,
	scopes: SCOPES,
});
const gdrive = google.drive({ version: 'v3', auth });

router.get('/getSemesters', async (req, res) => {
	try {
		const { data } = await gdrive.files.list({
			q: `'${'1u-qIeQx-G1Lt3QTSSF4tpBh-KUfRsqHQ'}' in parents and trashed=false`,
			fields: 'nextPageToken, files(id, name,description)',
			spaces: 'drive',
			orderBy: 'name',
		});

		res.send({ semesters: data.files, folderId: '1u-qIeQx-G1Lt3QTSSF4tpBh-KUfRsqHQ' });
	} catch (error) {
		res.send(error.message);
	}
});

router.get('/getCourses/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { data } = await gdrive.files.list({
			q: `'${id}' in parents and trashed=false`,
			fields: 'nextPageToken, files(id, name,description)',
			spaces: 'drive',
			orderBy: 'name',
		});
		res.send(data.files);
	} catch (error) {
		res.send(error.message);
	}
});
router.get('/getSlides/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { data } = await gdrive.files.list({
			q: `'${id}' in parents and trashed=false`,
			fields: '*',
			spaces: 'drive',
			orderBy: 'name',
		});
		res.send(data.files);
	} catch (error) {
		res.send(error.message);
	}
});

router.post('/createFolder', async (req, res) => {
	try {
		const { name, parent } = req.body;
		const folderResponse = await gdrive.files.create({
			resource: {
				name: name,
				mimeType: 'application/vnd.google-apps.folder',
				parents: [parent],
			},
			fields: '*',
		});

		console.log(folderResponse);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
