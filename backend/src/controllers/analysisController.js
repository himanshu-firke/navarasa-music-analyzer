const axios = require('axios')
const path = require('path')
const fs = require('fs')
const FormData = require('form-data')
const Analysis = require('../models/Analysis')

exports.analyzeAudio = async (req, res) => {
  try {
    const { fileId } = req.body

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      })
    }

    // Get file path
    const filePath = path.join(__dirname, '../../uploads', fileId)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      })
    }

    const fileStats = fs.statSync(filePath)

    // Call ML service
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000'
    
    // Create form data for ML service
    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath))

    let mlResponse
    try {
      mlResponse = await axios.post(`${mlServiceUrl}/predict`, formData, {
        headers: formData.getHeaders(),
        timeout: 120000, // 120 seconds (for cold starts on free tier)
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      })
    } catch (mlError) {
      console.error('ML Service error:', mlError.message)
      console.error('ML Service full error:', mlError.response?.data || mlError)
      
      // Return error instead of mock data
      return res.status(503).json({
        success: false,
        message: 'ML service is currently waking up (cold start). Please wait a moment and try again.',
        error: mlError.message,
        hint: 'Free tier services sleep after inactivity. The service is starting up now.'
      })
    }

    // Save analysis to database
    const analysis = new Analysis({
      filename: fileId,
      fileSize: fileStats.size,
      filePath: filePath,
      emotions: mlResponse.data.emotions,
      primaryEmotion: mlResponse.data.primaryEmotion,
      confidence: mlResponse.data.confidence,
      audioFeatures: mlResponse.data.features || {},
    })

    await analysis.save()

    res.status(200).json({
      success: true,
      message: 'Audio analyzed successfully',
      data: {
        id: analysis._id,
        filename: analysis.filename,
        emotions: analysis.emotions,
        primaryEmotion: analysis.primaryEmotion,
        confidence: analysis.confidence,
        audioFeatures: analysis.audioFeatures,
        createdAt: analysis.createdAt,
      }
    })

  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to analyze audio',
      error: error.message
    })
  }
}
