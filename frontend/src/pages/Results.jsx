import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Share2, FileDown } from 'lucide-react'
import { getAnalysisById } from '../services/api'
import { NAVARASAS } from '../utils/constants'
import { getPrimaryEmotion, formatConfidence, getEmotionColor } from '../utils/helpers'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { downloadResultsAsPDF } from '../utils/pdfGenerator'

const Results = () => {
  const { id } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    loadAnalysis()
  }, [id])

  const loadAnalysis = async () => {
    try {
      const response = await getAnalysisById(id)
      console.log('Analysis data:', response)
      // Backend returns { success, data: { ...analysis } }
      const data = response.data || response
      setAnalysis(data)
    } catch (error) {
      console.error('Failed to load analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!analysis) return
    
    try {
      setDownloading(true)
      const primaryEmotion = getPrimaryEmotion(analysis.emotions)
      const primaryRasa = NAVARASAS[primaryEmotion]
      
      const chartData = Object.entries(analysis.emotions).map(([key, value]) => ({
        name: NAVARASAS[key].name,
        value: parseFloat((value * 100).toFixed(1)),
        percentage: (value * 100).toFixed(1),
        color: NAVARASAS[key].color,
      })).sort((a, b) => b.value - a.value)

      console.log('Generating PDF with data:', { analysis, primaryRasa, chartData })
      await downloadResultsAsPDF(analysis, primaryRasa, chartData)
      
      // Success message
      console.log('PDF downloaded successfully!')
    } catch (error) {
      console.error('Failed to download PDF:', error)
      console.error('Error details:', error.message, error.stack)
      alert(`Failed to download PDF: ${error.message}\nPlease check the console for more details.`)
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    if (!analysis) return

    const primaryEmotion = getPrimaryEmotion(analysis.emotions)
    const primaryRasa = NAVARASAS[primaryEmotion]
    const shareUrl = window.location.href
    const shareText = `🎵 My music analysis results: ${primaryRasa.emoji} ${primaryRasa.name} (${formatConfidence(analysis.confidence)}) - Navarasa Music Emotion Analyzer`

    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Navarasa Music Analysis Results',
          text: shareText,
          url: shareUrl
        })
      } catch (error) {
        // User cancelled or share failed
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error)
          fallbackCopyToClipboard(shareUrl, shareText)
        }
      }
    } else {
      // Fallback: Copy to clipboard
      fallbackCopyToClipboard(shareUrl, shareText)
    }
  }

  const fallbackCopyToClipboard = (url, text) => {
    const fullText = `${text}\n${url}`
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText)
        .then(() => {
          alert('✅ Link copied to clipboard! You can now share it.')
        })
        .catch(err => {
          console.error('Failed to copy:', err)
          // Last resort: show alert with text to copy manually
          prompt('Copy this link to share:', fullText)
        })
    } else {
      // Fallback for older browsers
      prompt('Copy this link to share:', fullText)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Analysis not found</p>
      </div>
    )
  }

  const primaryEmotion = getPrimaryEmotion(analysis.emotions)
  const primaryRasa = NAVARASAS[primaryEmotion]
  
  // Convert chart data to numbers (not strings) for proper rendering
  const chartData = Object.entries(analysis.emotions).map(([key, value]) => ({
    name: NAVARASAS[key].name.substring(0, 6), // Shorten for mobile
    fullName: NAVARASAS[key].name,
    value: parseFloat((value * 100).toFixed(1)), // Convert to number
    percentage: (value * 100).toFixed(1), // Keep as string for display
    color: NAVARASAS[key].color,
  })).sort((a, b) => b.value - a.value) // Sort by value descending

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Primary Emotion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div
            className="rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 text-center shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${primaryRasa.color}20, ${primaryRasa.color}40)`,
            }}
          >
            <div className="text-5xl sm:text-6xl lg:text-8xl mb-3 sm:mb-4">{primaryRasa.emoji}</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {primaryRasa.name}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              {primaryRasa.sanskrit} • {primaryRasa.english}
            </p>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4" style={{ color: primaryRasa.color }}>
              {formatConfidence(analysis.confidence)}
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              {primaryRasa.description}
            </p>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 pb-6 sm:pb-8"
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Emotion Distribution
            </h2>
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="38%"
                  labelLine={false}
                  label={(entry) => {
                    // Only show label if percentage is >= 12% on mobile
                    const threshold = window.innerWidth < 640 ? 12 : 8
                    if (entry.value >= threshold) {
                      return window.innerWidth < 640 ? `${entry.percentage}%` : `${entry.name}: ${entry.percentage}%`
                    }
                    return ''
                  }}
                  outerRadius={window.innerWidth < 640 ? 70 : 110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '10px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={60}
                  wrapperStyle={{ paddingTop: '20px', fontSize: '9px', lineHeight: '1.4' }}
                  iconSize={7}
                  formatter={(value, entry) => window.innerWidth < 640 ? `${value}` : `${value}: ${entry.payload.percentage}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 pb-6 sm:pb-8"
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              All Emotions
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: 0, bottom: 85 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-50} 
                  textAnchor="end" 
                  height={90}
                  style={{ fontSize: '9px' }}
                  interval={0}
                />
                <YAxis 
                  style={{ fontSize: '9px' }}
                  width={32}
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '10px'
                  }}
                />
                <Bar dataKey="value" fill="#8884d8">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Legend 
                  wrapperStyle={{ fontSize: '9px', paddingTop: '12px', lineHeight: '1.4' }}
                  iconSize={7}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center"
        >
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
          >
            {downloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download as PDF</span>
              </>
            )}
          </button>
          <button 
            onClick={handleShare}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Results
