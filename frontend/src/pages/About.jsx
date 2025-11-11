import { NAVARASAS } from '../utils/constants'
import { Book, Users, Code } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
          About Navarasa Theory
        </h1>

        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <Book className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                What is Navarasa?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                <strong>Navarasa</strong> (नवरस) means "nine emotions" in Sanskrit. This ancient Indian theory 
                was described in the <strong>Natya Shastra</strong> by sage Bharata Muni around 200 BCE.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The theory states that all human emotions can be classified into nine fundamental rasas (emotions), 
                each representing a distinct emotional state that can be expressed through art, music, dance, and drama.
              </p>
            </div>
          </div>
        </div>

        {/* The Nine Emotions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            The Nine Navarasas
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(NAVARASAS).map(([key, rasa]) => (
              <div key={key} className="border-l-4 pl-3 sm:pl-4 py-2" style={{ borderColor: rasa.color }}>
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <span className="text-2xl sm:text-3xl">{rasa.emoji}</span>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                      {rasa.name} ({rasa.sanskrit})
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold" style={{ color: rasa.color }}>
                      {rasa.english}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  {rasa.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                  {rasa.characteristics.map((char, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How AI Works */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Code className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                How Our AI Analyzes Music
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                Our system uses <strong>YAMNet (Yet Another Mobile Network)</strong>, a deep learning model trained to recognize 
                patterns in audio that correspond to each Navarasa:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li><strong>Feature Extraction:</strong> Extract MFCCs, spectral features, tempo, and energy</li>
                <li><strong>Pattern Recognition:</strong> YAMNet identifies emotional patterns in the audio</li>
                <li><strong>Classification:</strong> AI predicts which Navarasa best matches the music</li>
                <li><strong>Confidence Score:</strong> Provides probability distribution across all 9 emotions</li>
              </ol>
            </div>
          </div>
        </div>

        {/* About Creator */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg p-6 sm:p-8 text-white text-center">
          <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Created by Himanshu Ganesh Firke</h2>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">
            A research project combining ancient Indian cultural theory with modern AI technology
          </p>
          <p className="text-xs sm:text-sm opacity-90">
            Built with React, Node.js, Python, TensorFlow, and MongoDB
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
