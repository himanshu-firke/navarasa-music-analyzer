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
    name: NAVARASAS[key].name,
    value: parseFloat((value * 100).toFixed(1)), // Convert to number
    percentage: (value * 100).toFixed(1), // Keep as string for display
    color: NAVARASAS[key].color,
  })).sort((a, b) => b.value - a.value) // Sort by value descending

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Primary Emotion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div
            className="rounded-2xl p-8 text-center shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${primaryRasa.color}20, ${primaryRasa.color}40)`,
            }}
          >
            <div className="text-8xl mb-4">{primaryRasa.emoji}</div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {primaryRasa.name}
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
              {primaryRasa.sanskrit} • {primaryRasa.english}
            </p>
            <div className="text-6xl font-bold mb-4" style={{ color: primaryRasa.color }}>
              {formatConfidence(analysis.confidence)}
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {primaryRasa.description}
            </p>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 pb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Emotion Distribution
            </h2>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  label={(entry) => {
                    // Only show label if percentage is >= 5%
                    if (entry.value >= 5) {
                      return `${entry.name}: ${entry.percentage}%`
                    }
                    return ''
                  }}
                  outerRadius={110}
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
                  height={50}
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value, entry) => `${value}: ${entry.payload.percentage}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 pb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              All Emotions
            </h2>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={90}
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 20]}
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
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
          <button className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Results
