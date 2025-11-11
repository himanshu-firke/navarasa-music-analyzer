const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
  },
  emotions: {
    shringara: { type: Number, default: 0 },
    hasya: { type: Number, default: 0 },
    karuna: { type: Number, default: 0 },
    raudra: { type: Number, default: 0 },
    veera: { type: Number, default: 0 },
    bhayanaka: { type: Number, default: 0 },
    bibhatsa: { type: Number, default: 0 },
    adbhuta: { type: Number, default: 0 },
    shanta: { type: Number, default: 0 },
  },
  primaryEmotion: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  audioFeatures: {
    tempo: Number,
    energy: Number,
    key: String,
  },
}, {
  timestamps: true,
})

// Index for faster queries
analysisSchema.index({ primaryEmotion: 1 })
analysisSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Analysis', analysisSchema)
