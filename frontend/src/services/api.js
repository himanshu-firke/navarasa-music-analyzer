import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for file upload and analysis
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// Upload service
export const uploadAudio = async (file, onProgress) => {
  const formData = new FormData()
  formData.append('audio', file)
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      if (onProgress) onProgress(percentCompleted)
    },
  })
  
  return response
}

// Analysis service
export const analyzeAudio = async (fileId) => {
  return await api.post('/analyze', { fileId })
}

// History service
export const getHistory = async (params = {}) => {
  const { page = 1, limit = 12, emotion, sortBy = 'createdAt' } = params
  return await api.get('/history', {
    params: { page, limit, emotion, sortBy }
  })
}

// Alias for getting all analyses (used by History and Compare pages)
export const getAllAnalyses = async () => {
  const response = await api.get('/history', {
    params: { page: 1, limit: 100 } // Get all recent analyses
  })
  
  // Backend returns: { success: true, data: { analyses: [...], pagination: {...} } }
  // We need to extract just the analyses array
  return {
    data: response.data?.analyses || []
  }
}

export const getAnalysisById = async (id) => {
  return await api.get(`/history/${id}`)
}

export const deleteAnalysis = async (id) => {
  return await api.delete(`/history/${id}`)
}

// Comparison service
export const compareAudios = async (fileIds) => {
  return await api.post('/compare', { fileIds })
}

// Contact service
export const submitContactForm = async (formData) => {
  return await api.post('/contact', formData)
}

export default api
