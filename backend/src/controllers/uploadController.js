const path = require('path')

exports.uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const fileData = {
      fileId: req.file.filename,
      filename: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimetype: req.file.mimetype,
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: fileData
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    })
  }
}
