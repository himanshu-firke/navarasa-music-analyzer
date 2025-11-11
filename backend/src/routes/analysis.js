const express = require('express')
const router = express.Router()
const { analyzeAudio } = require('../controllers/analysisController')

// POST /api/analyze - Analyze uploaded audio
router.post('/', analyzeAudio)

module.exports = router
