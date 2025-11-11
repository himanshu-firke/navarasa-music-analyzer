import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllAnalyses, deleteAnalysis } from '../services/api'
import { NAVARASAS } from '../utils/constants'
import { Clock, Trash2, Eye, Music, Calendar, TrendingUp } from 'lucide-react'

const History = () => {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllAnalyses()
      setAnalyses(response.data || [])
    } catch (err) {
      console.error('Error loading history:', err)
      setError('Failed to load analysis history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return
    }

    try {
      setDeleting(id)
      await deleteAnalysis(id)
      setAnalyses(analyses.filter(a => a._id !== id))
    } catch (err) {
      console.error('Error deleting analysis:', err)
      alert('Failed to delete analysis')
    } finally {
      setDeleting(null)
    }
  }

  const handleView = (id) => {
    navigate(`/results/${id}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Analysis History
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your history...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Analysis History
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadHistory}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Analysis History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg px-2">
            View and manage your past emotion analyses
          </p>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No analyses yet
            </p>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Upload and analyze your first song to get started!
            </p>
            <button
              onClick={() => navigate('/analyze')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Analyze Your First Song
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Total Analyses: <span className="font-bold text-gray-900 dark:text-white">{analyses.length}</span>
              </p>
              <button
                onClick={loadHistory}
                className="px-4 py-2 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {analyses.map((analysis) => {
                const primaryRasa = NAVARASAS[analysis.primaryEmotion] || {}
                
                return (
                  <div
                    key={analysis._id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Header with primary emotion */}
                    <div 
                      className="p-4 sm:p-6 text-white"
                      style={{ background: `linear-gradient(135deg, ${primaryRasa.color || '#6366f1'} 0%, ${primaryRasa.color || '#6366f1'}dd 100%)` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl sm:text-4xl">{primaryRasa.emoji || '🎵'}</span>
                        <span className="text-xs sm:text-sm font-semibold bg-white/20 px-2 sm:px-3 py-1 rounded-full">
                          {(analysis.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-1">
                        {primaryRasa.name || analysis.primaryEmotion}
                      </h3>
                      <p className="text-xs sm:text-sm opacity-90">
                        {primaryRasa.english || 'Emotion'}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                          <Music className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                          <span className="font-semibold truncate text-sm sm:text-base">{analysis.filename}</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                          <span>{formatDate(analysis.createdAt)}</span>
                        </div>
                      </div>

                      {/* Top emotions */}
                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Top Emotions
                        </p>
                        <div className="space-y-1">
                          {Object.entries(analysis.emotions)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([emotion, value]) => {
                              const rasa = NAVARASAS[emotion] || {}
                              return (
                                <div key={emotion} className="flex items-center justify-between text-xs sm:text-sm">
                                  <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                                    {rasa.emoji} {rasa.name || emotion}
                                  </span>
                                  <span className="font-semibold flex-shrink-0" style={{ color: rasa.color }}>
                                    {(value * 100).toFixed(0)}%
                                  </span>
                                </div>
                              )
                            })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(analysis._id)}
                          className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all text-xs sm:text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(analysis._id)}
                          disabled={deleting === analysis._id}
                          className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {deleting === analysis._id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default History
