import { useState, useEffect } from 'react'
import { getAllAnalyses } from '../services/api'
import { NAVARASAS } from '../utils/constants'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Check, X, Music2, TrendingUp } from 'lucide-react'

const Compare = () => {
  const [analyses, setAnalyses] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalyses()
  }, [])

  const loadAnalyses = async () => {
    try {
      setLoading(true)
      const response = await getAllAnalyses()
      setAnalyses(response.data || [])
    } catch (err) {
      console.error('Error loading analyses:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id])
      }
    }
  }

  const selectedAnalyses = analyses.filter(a => selectedIds.includes(a._id))

  // Prepare comparison data for bar chart
  const comparisonData = Object.keys(NAVARASAS).map(emotion => {
    const dataPoint = {
      emotion: NAVARASAS[emotion].name,
      emoji: NAVARASAS[emotion].emoji
    }
    
    selectedAnalyses.forEach((analysis, idx) => {
      dataPoint[`song${idx + 1}`] = (analysis.emotions[emotion] || 0) * 100
    })
    
    return dataPoint
  })

  // Prepare radar chart data
  const radarData = Object.keys(NAVARASAS).map(emotion => {
    const dataPoint = {
      emotion: NAVARASAS[emotion].name.substring(0, 10)
    }
    
    selectedAnalyses.forEach((analysis, idx) => {
      dataPoint[`Song ${idx + 1}`] = (analysis.emotions[emotion] || 0) * 100
    })
    
    return dataPoint
  })

  const colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading analyses...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Compare Songs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Select up to 4 songs to compare their emotional profiles
          </p>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Music2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No analyses available
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Analyze some songs first to enable comparison
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Selection Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Select Songs ({selectedIds.length}/4)
                </h2>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {analyses.map((analysis) => {
                    const isSelected = selectedIds.includes(analysis._id)
                    const primaryRasa = NAVARASAS[analysis.primaryEmotion] || {}
                    
                    return (
                      <div
                        key={analysis._id}
                        onClick={() => toggleSelection(analysis._id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{primaryRasa.emoji}</span>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                {analysis.filename}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {primaryRasa.name}
                              </p>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'bg-pink-500 border-pink-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Comparison Panel */}
            <div className="lg:col-span-2">
              {selectedAnalyses.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Select songs from the left to compare
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selected Songs Summary */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Selected Songs
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedAnalyses.map((analysis, idx) => {
                        const primaryRasa = NAVARASAS[analysis.primaryEmotion] || {}
                        return (
                          <div key={analysis._id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: colors[idx] }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                {analysis.filename}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {primaryRasa.emoji} {primaryRasa.name}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleSelection(analysis._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Bar Chart Comparison */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Emotion Distribution Comparison
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="emotion" 
                          stroke="#9ca3af"
                          tick={{ fill: '#9ca3af' }}
                        />
                        <YAxis 
                          stroke="#9ca3af"
                          tick={{ fill: '#9ca3af' }}
                          label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Legend />
                        {selectedAnalyses.map((analysis, idx) => (
                          <Bar 
                            key={idx}
                            dataKey={`song${idx + 1}`}
                            fill={colors[idx]}
                            name={`Song ${idx + 1}: ${analysis.filename.substring(0, 20)}`}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Radar Chart */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Emotional Profile Radar
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis 
                          dataKey="emotion"
                          stroke="#9ca3af"
                          tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <PolarRadiusAxis 
                          stroke="#9ca3af"
                          tick={{ fill: '#9ca3af' }}
                        />
                        {selectedAnalyses.map((analysis, idx) => (
                          <Radar
                            key={idx}
                            name={`Song ${idx + 1}`}
                            dataKey={`Song ${idx + 1}`}
                            stroke={colors[idx]}
                            fill={colors[idx]}
                            fillOpacity={0.3}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Dominant Emotions Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Dominant Emotions
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                              Song
                            </th>
                            <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                              Primary Emotion
                            </th>
                            <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                              Confidence
                            </th>
                            <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                              Secondary Emotion
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAnalyses.map((analysis, idx) => {
                            const primaryRasa = NAVARASAS[analysis.primaryEmotion] || {}
                            const sortedEmotions = Object.entries(analysis.emotions)
                              .sort(([, a], [, b]) => b - a)
                            const secondary = sortedEmotions[1]
                            const secondaryRasa = NAVARASAS[secondary[0]] || {}
                            
                            return (
                              <tr key={analysis._id} className="border-b border-gray-100 dark:border-gray-700">
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-2">
                                    <div 
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: colors[idx] }}
                                    />
                                    <span className="text-gray-900 dark:text-white text-sm">
                                      {analysis.filename.substring(0, 25)}...
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-2">
                                    <span>{primaryRasa.emoji}</span>
                                    <span className="text-gray-900 dark:text-white font-semibold">
                                      {primaryRasa.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-gray-900 dark:text-white font-bold">
                                    {(analysis.confidence * 100).toFixed(0)}%
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-2">
                                    <span>{secondaryRasa.emoji}</span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {secondaryRasa.name} ({(secondary[1] * 100).toFixed(0)}%)
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Compare
