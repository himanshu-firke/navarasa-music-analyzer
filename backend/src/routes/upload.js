const express = require('express')
const router = express.Router()
const upload = require('../middleware/fileUpload')
const { uploadAudio } = require('../controllers/uploadController')

// POST /api/upload - Upload audio file
router.post('/', upload.single('audio'), uploadAudio)

module.exports = router
