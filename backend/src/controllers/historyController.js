const Analysis = require('../models/Analysis')
const fs = require('fs')

// Get all analyses with pagination
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const emotion = req.query.emotion
    const sortBy = req.query.sortBy || 'createdAt'

    const query = {}
    if (emotion) {
      query.primaryEmotion = emotion
    }

    const skip = (page - 1) * limit

    const analyses = await Analysis.find(query)
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(limit)
      .select('-filePath')

    const total = await Analysis.countDocuments(query)

    res.status(200).json({
      success: true,
      data: {
        analyses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        }
      }
    })
  } catch (error) {
    console.error('Get history error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
      error: error.message
    })
  }
}

// Get specific analysis by ID
exports.getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params

    const analysis = await Analysis.findById(id)

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      })
    }

    res.status(200).json({
      success: true,
      data: analysis
    })
  } catch (error) {
    console.error('Get analysis error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis',
      error: error.message
    })
  }
}

// Delete analysis
exports.deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params

    const analysis = await Analysis.findById(id)

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      })
    }

    // Delete file from disk
    if (fs.existsSync(analysis.filePath)) {
      fs.unlinkSync(analysis.filePath)
    }

    // Delete from database
    await Analysis.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully'
    })
  } catch (error) {
    console.error('Delete analysis error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete analysis',
      error: error.message
    })
  }
}
