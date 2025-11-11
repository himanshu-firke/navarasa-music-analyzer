import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Music, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { uploadAudio, analyzeAudio } from '../services/api'
import { validateFile, formatFileSize } from '../utils/helpers'

const Analyze = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleFileSelection = (selectedFile) => {
    const validation = validateFile(selectedFile)
    
    if (!validation.valid) {
      setError(validation.errors.join('. '))
      setFile(null)
      return
    }
    
    setError(null)
    setFile(selectedFile)
  }

  const handleAnalyze = async () => {
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      
      // Upload file
      const uploadResponse = await uploadAudio(file, (progress) => {
        setUploadProgress(progress)
      })
      
      console.log('Upload response:', uploadResponse)
      
      setUploading(false)
      setAnalyzing(true)
      
      // Get fileId from response (backend returns { success, message, data: { fileId } })
      const fileId = uploadResponse.data?.fileId || uploadResponse.fileId
      
      if (!fileId) {
        throw new Error('No file ID received from upload')
      }
      
      // Analyze file
      const analysisResponse = await analyzeAudio(fileId)
      
      console.log('Analysis response:', analysisResponse)
      
      // Navigate to results page (backend returns { success, message, data: { id, ... } })
      const analysisId = analysisResponse.data?.id || analysisResponse.id
      
      if (!analysisId) {
        throw new Error('No analysis ID received')
      }
      
      navigate(`/results/${analysisId}`)
      
    } catch (err) {
      setError(err.message || 'Failed to analyze audio')
      setUploading(false)
      setAnalyzing(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setError(null)
    setUploadProgress(0)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Analyze Your Music
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload an audio file to discover its emotional essence
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8"
        >
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                dragActive
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-pink-400'
              }`}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Drop your audio file here
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                or click to browse
              </p>
              <input
                type="file"
                id="file-upload"
                accept=".mp3,.wav,.flac,.ogg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold cursor-pointer hover:scale-105 transition-transform"
              >
                Choose File
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                Supported formats: MP3, WAV, FLAC, OGG (Max 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {file.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {!uploading && !analyzing && (
                  <button
                    onClick={clearFile}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Progress */}
              {(uploading || analyzing) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {uploading ? 'Uploading...' : 'Analyzing emotions... This may take 10-30 seconds'}
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {uploading ? `${uploadProgress}%` : '⏳'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300 ${
                        analyzing ? 'animate-pulse' : ''
                      }`}
                      style={{ width: uploading ? `${uploadProgress}%` : '100%' }}
                    />
                  </div>
                  {analyzing && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                      🎵 Extracting audio features and analyzing emotions...
                    </p>
                  )}
                </div>
              )}

              {/* Analyze Button */}
              {!uploading && !analyzing && (
                <button
                  onClick={handleAnalyze}
                  className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg"
                >
                  Analyze Emotion
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Upload Audio', desc: 'Choose your music file (MP3, WAV, FLAC, or OGG)' },
              { step: 2, title: 'AI Analysis', desc: 'Our CNN model extracts audio features and analyzes patterns' },
              { step: 3, title: 'Emotion Detection', desc: 'AI predicts which Navarasa your music embodies' },
              { step: 4, title: 'View Results', desc: 'See detailed emotion breakdown with charts and descriptions' },
            ].map((item) => (
              <div key={item.step} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analyze
