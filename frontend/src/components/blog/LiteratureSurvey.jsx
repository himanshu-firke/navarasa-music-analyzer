import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

const LiteratureSurvey = () => {
  const literatureItems = [
    {
      label: 'A',
      title: 'Music Emotion Recognition and Analysis',
      content: `Music emotion recognition (MER) has been an active area of research in Music Information Retrieval (MIR). 
      Studies have shown that musical features such as tempo, rhythm, harmony, and timbre significantly influence emotional 
      perception. Research by Yang and Chen (2012) demonstrated that combining audio features with machine learning classifiers 
      can effectively predict emotional responses to music. These foundational works informed our approach to mapping audio 
      characteristics to the nine Navarasa emotions.`
    },
    {
      label: 'B',
      title: 'Audio Classification using Deep Learning',
      content: `The emergence of deep learning has revolutionized audio classification tasks. Google's YAMNet, based on the 
      MobileNet architecture, provides robust audio event detection capabilities. Studies by Hershey et al. (2017) on AudioSet 
      and CNN-based audio classification demonstrated that pre-trained models can be effectively adapted for music emotion 
      recognition tasks. Our project leverages YAMNet's capabilities, fine-tuning its outputs to map to emotional categories.`
    },
    {
      label: 'C',
      title: 'Audio Feature Extraction and Processing',
      content: `Audio feature extraction is crucial for music analysis. Librosa, a Python library for audio analysis, provides 
      comprehensive tools for extracting features like mel-spectrograms, MFCCs, chroma features, and tempo. Research by McFee 
      et al. (2015) established best practices for audio feature extraction that we employ in our system to capture the acoustic 
      properties relevant to emotional content.`
    },
    {
      label: 'D',
      title: 'Nava Rasa Theory in Music Analysis',
      content: `The Nava Rasa theory from Indian classical music provides a culturally-rooted framework for emotion classification. 
      Studies on Indian Classical Music emotion detection have shown the relevance of mapping Western audio features to traditional 
      Rasa categories. Research on North Indian Classical Music (NICM) mood detection provides valuable insights into connecting 
      acoustic features with the nine emotional states, which forms the theoretical foundation of our classification approach.`
    },
    {
      label: 'E',
      title: 'Full-Stack Web Applications for ML Services',
      content: `Modern ML applications require robust full-stack architectures. The integration of React for frontend development, 
      Node.js for backend services, and Python-based ML microservices has become a standard pattern. Research on microservice 
      architectures for AI applications demonstrates the benefits of separating concerns, allowing for independent scaling and 
      maintenance of ML models while providing responsive user interfaces.`
    }
  ]

  return (
    <section id="literature" data-section="literature" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <BookOpen className="w-10 h-10 text-pink-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Literature Survey
            </h2>
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Music emotion analysis has evolved significantly with advances in machine learning and audio processing. 
            Our research builds upon existing work in Music Information Retrieval (MIR), deep learning for audio 
            classification, and the rich tradition of Nava Rasa theory from Indian classical music. By examining 
            previous studies in emotion recognition, audio feature extraction, and culturally-informed classification 
            frameworks, we developed a comprehensive approach to music emotion analysis.
          </p>

          <div className="space-y-6">
            {literatureItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg"
              >
                <div 
                  className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-xl md:text-2xl"
                >
                  {item.label}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default LiteratureSurvey
