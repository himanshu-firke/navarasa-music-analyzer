import { motion } from 'framer-motion'
import { Music } from 'lucide-react'

const HeroSection = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div 
            className="flex justify-center mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Music className="w-16 h-16" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Emotion-Based Music Analysis
          </h1>
          
          <p className="text-2xl md:text-3xl mb-4 text-pink-100 font-semibold">
            Using Artificial Intelligence
          </p>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
            Exploring the intersection of Indian Classical Music, Machine Learning, 
            and Emotion Recognition through the ancient wisdom of Nava Rasa
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => scrollToSection('abstract')}
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              Read Research
            </button>
            <button 
              onClick={() => window.location.href = '/analyze'}
              className="px-8 py-4 bg-purple-800/50 backdrop-blur-sm text-white rounded-lg font-semibold text-lg hover:bg-purple-800/70 transition-all hover:scale-105 border-2 border-white/30"
            >
              Try the App
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            fill="currentColor" 
            fillOpacity="0.2" 
            d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,74.7C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            className="text-gray-50 dark:text-gray-900"
          />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
