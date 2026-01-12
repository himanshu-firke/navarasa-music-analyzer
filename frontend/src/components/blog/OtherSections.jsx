import { motion } from 'framer-motion'
import { Target, Rocket, Users, CheckCircle } from 'lucide-react'
import BlogImage from './BlogImage'

// Results Section
export const ResultsSection = () => (
  <section id="results" data-section="results" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-4 mb-8">
          <Target className="w-10 h-10 text-pink-500" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Results
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            The Navarasa Music Emotion Analyzer has been tested with diverse music files across various genres, 
            languages, and cultural backgrounds. The system successfully analyzed audio files and provided emotion 
            distributions that aligned well with subjective human assessments. Using Librosa-driven feature extraction 
            combined with the enhanced rule-based classifier, the system achieved accuracy rates of roughly 60-70% in 
            identifying the primary emotion, with higher confidence in songs with distinct emotional characteristics.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            User testing revealed high satisfaction with the intuitive interface, real-time analysis capabilities, 
            and comprehensive visualization features. The comparison functionality proved particularly valuable, 
            allowing users to understand emotional differences across their music library. The system performed well 
            across different audio qualities and formats, demonstrating robustness in real-world scenarios. Refining the 
            Librosa feature heuristics or introducing a custom-trained CNN remains a key opportunity for improving accuracy.
          </p>

          <BlogImage 
            src="/blog-images/image.png"
            alt="Navarasa Music Emotion Analysis Results"
            caption="Sample analysis results showing Shringara (Love & Beauty) as the primary emotion with 15.1% confidence, along with emotion distribution pie chart and comparative bar chart visualization"
            width="2xl"
            zoom={true}
          />
        </div>
      </motion.div>
    </div>
  </section>
)

// Future Scope Section
export const FutureScopeSection = () => {
  const futureGoals = [
    {
      title: 'Train Custom Deep Learning Model',
      description: 'Develop and fine-tune a bespoke CNN or transformer-based classifier on a large labeled dataset of music files mapped to Navarasa emotions. This would improve accuracy beyond the current Librosa + heuristics baseline, providing more precise emotion detection tailored to the nine Rasa categories.'
    },
    {
      title: 'Real-time Streaming Analysis',
      description: 'Extend the system to analyze music from streaming services like Spotify, YouTube Music, or Apple Music in real-time. Users could discover emotions in their streaming playlists and receive emotion-based recommendations without downloading files.'
    },
    {
      title: 'Playlist Emotion Analysis',
      description: 'Implement batch processing to analyze entire playlists or music libraries, generating emotional profiles and insights. Users could see the overall emotional distribution of their collection and create emotion-based smart playlists automatically.'
    },
    {
      title: 'User Personalization and Learning',
      description: 'Incorporate user feedback to personalize emotion mappings based on individual perception. The system could learn from user corrections and adjustments, adapting the emotion detection algorithm to match personal emotional associations with music.'
    }
  ]

  return (
    <section id="future" data-section="future" className="py-16 px-4 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Rocket className="w-10 h-10 text-purple-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Future Scope
            </h2>
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            The Navarasa Music Emotion Analyzer has significant potential for future enhancements and expansions. 
            Several promising directions could improve accuracy, expand functionality, and provide even greater 
            value to users:
          </p>

          <div className="grid gap-6">
            {futureGoals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-6 border-l-4 border-purple-500"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {goal.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {goal.description}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-8">
            These enhancements will expand the system's capabilities and make it more versatile for various applications, 
            including music therapy, personalized music recommendations, academic research on music and emotion, and 
            cultural preservation of the Nava Rasa tradition.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// Acknowledgments Section
export const AcknowledgmentsSection = () => (
  <section id="acknowledgments" data-section="acknowledgments" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-4 mb-8">
          <Users className="w-10 h-10 text-pink-500" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Acknowledgments
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            This project was developed by <strong>Himanshu Ganesh Firke</strong> as part of exploring the 
            intersection of traditional cultural frameworks and modern machine learning technologies. Special 
            thanks to the open-source community for providing excellent tools like React, TensorFlow, and Librosa 
            that made this project possible.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            I would also like to acknowledge the foundational research in Music Information Retrieval and the rich 
            tradition of Indian classical music theory, particularly the Nava Rasa framework by Bharata Muni, which 
            inspired and guided this project's approach to emotion classification.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
)

// Conclusion Section
export const ConclusionSection = () => (
  <section id="conclusion" data-section="conclusion" className="py-16 px-4 bg-white dark:bg-gray-800">
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-4 mb-8">
          <CheckCircle className="w-10 h-10 text-purple-500" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Conclusion
          </h2>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 shadow-xl">
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            The Navarasa Music Emotion Analyzer successfully demonstrates how ancient cultural wisdom can be integrated 
            with modern artificial intelligence to create meaningful applications. By mapping audio features to the nine 
            classical Navarasa emotions, the system provides users with insights into the emotional content of their 
            music in an accessible and intuitive way.
          </p>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Built with a modern full-stack architecture combining React, Node.js, MongoDB, and Python-based ML services, 
            the application currently achieves about 60-70% accuracy using Librosa features with a rule-based classifier. 
            Future enhancements with custom-trained models could push accuracy even higher. This project opens doors for 
            applications in music recommendation, therapeutic interventions, cultural preservation, and academic research, 
            bridging the gap between technology and the timeless emotional language of music.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
)
