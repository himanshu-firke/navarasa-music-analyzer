import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

const AbstractSection = () => {
  return (
    <section id="abstract" data-section="abstract" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <BookOpen className="w-10 h-10 text-pink-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Abstract
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl">
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Music has the extraordinary ability to evoke deep emotions and connect with listeners on a profound level. 
              In this project, we present <strong className="text-pink-600 dark:text-pink-400">"Navarasa Music Emotion Analyzer,"</strong>{' '}
              an innovative web application that analyzes music files to identify and quantify the emotions they evoke. 
              Using <strong>Librosa</strong> for high-resolution audio feature extraction together with a finely tuned 
              rule-based scoring engine, we map musical characteristics to emotional states without relying on opaque 
              black-box models.
            </p>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Based on the Nava Rasas from Indian classical music theory, our system analyzes uploaded audio files and 
              identifies nine fundamental emotions present in the music. The application features a modern React frontend, 
              Node.js backend, and Python-based ML service, creating an accessible and interactive platform for users to 
              discover the emotional landscape of their favorite songs.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AbstractSection
