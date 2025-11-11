import { NAVARASAS, SUPPORTED_FORMATS, MAX_FILE_SIZE } from './constants'

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const validateFile = (file) => {
  const errors = []
  
  if (!file) {
    errors.push('No file selected')
    return { valid: false, errors }
  }
  
  const extension = '.' + file.name.split('.').pop().toLowerCase()
  if (!SUPPORTED_FORMATS.includes(extension)) {
    errors.push(`Unsupported format. Supported: ${SUPPORTED_FORMATS.join(', ')}`)
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File too large. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}`)
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export const getEmotionColor = (emotionKey) => {
  return NAVARASAS[emotionKey]?.color || '#666'
}

export const getEmotionGradient = (emotionKey) => {
  return NAVARASAS[emotionKey]?.gradient || 'from-gray-400 to-gray-600'
}

export const getPrimaryEmotion = (emotions) => {
  if (!emotions) return null
  
  let maxEmotion = null
  let maxValue = 0
  
  Object.entries(emotions).forEach(([key, value]) => {
    if (value > maxValue) {
      maxValue = value
      maxEmotion = key
    }
  })
  
  return maxEmotion
}

export const formatConfidence = (value) => {
  return (value * 100).toFixed(1) + '%'
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
