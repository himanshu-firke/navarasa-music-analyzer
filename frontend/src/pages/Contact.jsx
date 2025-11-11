import { useState } from 'react'
import { Mail, Github, Linkedin, Send, MessageSquare, User, MapPin } from 'lucide-react'
import { submitContactForm } from '../services/api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setError(null)
      
      await submitContactForm(formData)
      
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (err) {
      console.error('Contact form error:', err)
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg px-2">
            Have questions about the project? I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-pink-500" />
              Send a Message
            </h2>
            
            {submitted ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">
                  Message Sent!
                </h3>
                <p className="text-green-600 dark:text-green-500">
                  Thank you for reaching out. I'll get back to you soon!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
                    placeholder="Tell me more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center px-5 sm:px-6 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* About Me Card */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 text-white">
              <div className="flex items-center mb-3 sm:mb-4">
                <User className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold">Himanshu Ganesh Firke</h2>
              </div>
              <p className="mb-4 sm:mb-6 opacity-90 text-sm sm:text-base">
                Full-stack developer passionate about combining cultural heritage with modern AI technology. 
                This project demonstrates the intersection of ancient Indian philosophy and machine learning.
              </p>
              <div className="flex items-center mb-2 opacity-90">
                <MapPin className="w-5 h-5 mr-2" />
                <span>India</span>
              </div>
            </div>

            {/* Connect Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Connect With Me
              </h2>
              
              <div className="space-y-4">
                <a
                  href="mailto:himanshufirke04@gmail.com"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mr-4 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors">
                    <Mail className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">himanshufirke04@gmail.com</p>
                  </div>
                </a>

                <a
                  href="https://github.com/himanshu-firke/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <Github className="w-6 h-6 text-white dark:text-gray-900" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">GitHub</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@himanshu-firke</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/himanshufirke/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <Linkedin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">LinkedIn</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Himanshu Ganesh Firke</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Project Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                About This Project
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                Navarasa Music Emotion Analyzer is a full-stack machine learning application that classifies music 
                into nine classical Indian emotions using audio feature extraction and neural networks.
              </p>
              <a
                href="https://github.com/himanshu-firke/navarasa-music-analyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 mb-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:scale-105 transition-transform text-sm font-semibold"
              >
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </a>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full text-sm font-semibold">
                  React
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold">
                  Node.js
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                  Python
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                  TensorFlow
                </span>
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold">
                  MongoDB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
