import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Share2, Twitter, Linkedin, Link as LinkIcon, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'

// Import all blog components
import HeroSection from '../components/blog/HeroSection'
import ProblemStatement from '../components/blog/ProblemStatement'
import NavarasaExplanation from '../components/blog/NavarasaExplanation'
import AbstractSection from '../components/blog/AbstractSection'
import IntroductionSection from '../components/blog/IntroductionSection'
import LiteratureSurvey from '../components/blog/LiteratureSurvey'
import MethodologySection from '../components/blog/MethodologySection'
import { ResultsSection, FutureScopeSection, AcknowledgmentsSection, ConclusionSection } from '../components/blog/OtherSections'
import ReferencesSection from '../components/blog/ReferencesSection'

const Blog = () => {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [showTOC, setShowTOC] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(288) // 72 * 4 = 288px (w-72)
  const [isResizing, setIsResizing] = useState(false)

  const tableOfContents = [
    { id: 'problem', label: 'The Challenge', icon: '🎯' },
    { id: 'navarasa', label: 'What is Navarasa?', icon: '✨' },
    { id: 'abstract', label: 'Abstract', icon: '📖' },
    { id: 'introduction', label: 'Introduction', icon: '🎵' },
    { id: 'literature', label: 'Literature Survey', icon: '📚' },
    { id: 'methodology', label: 'Methodology', icon: '🧠' },
    { id: 'results', label: 'Results', icon: '📊' },
    { id: 'future', label: 'Future Scope', icon: '🚀' },
    { id: 'acknowledgments', label: 'Acknowledgments', icon: '👥' },
    { id: 'conclusion', label: 'Conclusion', icon: '✅' },
    { id: 'references', label: 'References', icon: '📄' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button
      setShowBackToTop(window.scrollY > 500)

      // Calculate scroll progress
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)

      // Update active section
      const sections = document.querySelectorAll('[data-section]')
      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        if (rect.top >= 0 && rect.top <= 200) {
          setActiveSection(section.dataset.section)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle sidebar resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return
      const newWidth = e.clientX - 32 // 32px offset from left
      if (newWidth >= 200 && newWidth <= 400) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setShowTOC(false)
    }
  }

  const shareArticle = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent('Emotion-Based Music Analysis Using AI - Navarasa')

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600 z-50 transition-all"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Table of Contents - Desktop */}
      {!sidebarCollapsed && (
        <aside 
          className="hidden xl:block fixed left-8 top-24 max-h-[calc(100vh-120px)] overflow-y-auto z-40 transition-all"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24 relative">
            {/* Collapse Button */}
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="absolute right-2 top-4 w-8 h-8 bg-pink-500 text-white rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors shadow-lg"
              title="Hide sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-2">
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Share Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Share Article
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => shareArticle('twitter')}
                  className="flex-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  title="Share on Twitter"
                >
                  <Twitter className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => shareArticle('linkedin')}
                  className="flex-1 p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => shareArticle('copy')}
                  className="flex-1 p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  title="Copy Link"
                >
                  <LinkIcon className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>

            {/* Resize Handle */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-pink-500 transition-colors"
              onMouseDown={() => setIsResizing(true)}
              title="Drag to resize"
            />
          </div>
        </aside>
      )}

      {/* Collapsed Sidebar Button */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="hidden xl:flex fixed left-8 top-24 w-10 h-10 bg-pink-500 text-white rounded-lg items-center justify-center hover:bg-pink-600 transition-colors shadow-xl z-40"
          title="Show sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Mobile TOC Toggle */}
      <button
        onClick={() => setShowTOC(!showTOC)}
        className="xl:hidden fixed bottom-24 right-4 z-50 w-14 h-14 bg-purple-600 text-white rounded-full shadow-xl flex items-center justify-center"
      >
        {showTOC ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile TOC Drawer */}
      {showTOC && (
        <div className="xl:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setShowTOC(false)}>
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute left-0 top-0 bottom-0 w-80 max-w-full bg-white dark:bg-gray-800 p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-2">
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <main 
        className="transition-all duration-300"
        style={{ 
          marginLeft: sidebarCollapsed ? '0' : window.innerWidth >= 1280 ? `${sidebarWidth + 64}px` : '0'
        }}
      >
        <HeroSection />
        <ProblemStatement />
        <NavarasaExplanation />
        <AbstractSection />
        <IntroductionSection />
        <LiteratureSurvey />
        <MethodologySection />
        <ResultsSection />
        <FutureScopeSection />
        <AcknowledgmentsSection />
        <ConclusionSection />
        <ReferencesSection />
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  )
}

export default Blog
