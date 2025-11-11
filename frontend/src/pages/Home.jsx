import { Link } from 'react-router-dom'
import { Music, Sparkles, TrendingUp, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { NAVARASAS } from '../utils/constants'

const Home = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: 'YAMNet deep learning model trained on thousands of audio samples for accurate emotion detection',
    },
    {
      icon: Globe,
      title: 'Cultural Heritage',
      description: 'Based on ancient Indian Navarasa theory from Natya Shastra',
    },
    {
      icon: TrendingUp,
      title: 'Instant Results',
      description: 'Get detailed emotion analysis in seconds with visual charts',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-bg opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Discover the Emotion
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">in Your Music</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
              Navarasa Music Analyzer uses AI to identify which of the nine classical Indian emotions 
              your music represents. Experience the fusion of ancient wisdom and modern technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                to="/analyze"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg text-sm sm:text-base"
              >
                Analyze Your Music
              </Link>
              <Link
                to="/about"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-700 hover:scale-105 transition-transform text-sm sm:text-base"
              >
                Learn About Navarasa
              </Link>
            </div>
          </motion.div>

          {/* Floating Music Icon */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-20 right-10 hidden lg:block"
          >
            <Music className="w-24 h-24 text-pink-500 opacity-20" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white">
            Why Navarasa Analyzer?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Navarasa Grid Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-900 dark:text-white">
            The Nine Navarasas
          </h2>
          <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
            Ancient Indian theory classifies all human emotions into nine fundamental rasas. 
            Our AI detects which one your music embodies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(NAVARASAS).map(([key, rasa], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-4 sm:p-6 rounded-xl bg-gradient-to-br shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${rasa.color}15, ${rasa.color}30)`,
                  borderLeft: `4px solid ${rasa.color}`,
                }}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {rasa.name}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                      {rasa.sanskrit}
                    </p>
                  </div>
                  <span className="text-3xl sm:text-4xl ml-2">{rasa.emoji}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold mb-2" style={{ color: rasa.color }}>
                  {rasa.english}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {rasa.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Discover Your Music's Emotion?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 px-2">
            Upload your song and let AI reveal its emotional essence in seconds.
          </p>
          <Link
            to="/analyze"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform shadow-xl text-sm sm:text-base"
          >
            Start Analyzing Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
