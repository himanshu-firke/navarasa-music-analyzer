import { motion } from 'framer-motion'
import { Music } from 'lucide-react'

const IntroductionSection = () => {
  return (
    <section id="introduction" data-section="introduction" className="py-16 px-4 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Music className="w-10 h-10 text-purple-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Introduction
            </h2>
          </div>

          <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Music is a universal language that transcends linguistic, cultural, and geographic boundaries. It possesses 
              a unique ability to evoke emotions, trigger memories, and create profound connections with the human soul. 
              Whether it's the uplifting energy of a joyous melody, the calming embrace of a peaceful tune, or the poignant 
              touch of a melancholic ballad, music has the power to influence our emotional state. In the digital age, 
              understanding these emotional connections has become increasingly important for music recommendation systems, 
              therapeutic applications, and enhancing user experiences.
            </p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-8 my-8 border-l-4 border-pink-500"
            >
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                "Navarasa Music Emotion Analyzer bridges ancient Indian classical music wisdom with modern AI, 
                creating a tool that helps users discover and understand the emotional content of their music."
              </p>
            </motion.div>

            <p>
              Drawing inspiration from the rich tapestry of emotions represented in the Nava Rasas of Indian classical 
              music—Love, Joy, Sadness, Anger, Courage, Fear, Disgust, Wonder, and Peace—our project aims to create an 
              intelligent system that can analyze any music file and identify its emotional composition. By integrating 
              state-of-the-art machine learning models, audio processing libraries, and modern web technologies, we've 
              built a comprehensive platform for music emotion analysis.
            </p>

            <p>
              The significance of this project lies in its ability to quantify the subjective experience of music through 
              objective analysis. Our system provides a dynamic and accessible platform for users to explore the emotional 
              dimensions of their music library. Built with a React frontend for intuitive user interaction, a Node.js 
              backend for robust API services, MongoDB for data persistence, and a Python-based ML service powered by 
              YAMNet and TensorFlow, the application offers features like emotion distribution visualization, historical 
              analysis tracking, and multi-song comparison capabilities.
            </p>

            <p>
              This documentation explores our complete implementation, from audio file processing and feature extraction 
              to machine learning inference and result visualization. We discuss the architectural decisions, the integration 
              of the YAMNet model for audio classification, and how we mapped audio features to the nine classical Navarasa 
              emotions. Additionally, we examine user feedback, system performance, and future enhancements that could further 
              improve accuracy and user experience. Our ultimate goal is to make emotion analysis in music accessible to 
              everyone while preserving and promoting the ancient wisdom of Nava Rasa theory.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default IntroductionSection
