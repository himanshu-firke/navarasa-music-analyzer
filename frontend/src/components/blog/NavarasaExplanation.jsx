import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { NAVARASAS } from '../../utils/constants'

const NavarasaExplanation = () => {
  return (
    <section id="navarasa" data-section="navarasa" className="py-16 px-4 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Sparkles className="w-12 h-12 text-purple-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              What is Nava Rasa?
            </h2>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 md:p-12 mb-12"
        >
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            <strong className="text-purple-600 dark:text-purple-400">Nava Rasa</strong> (Sanskrit: नवरस) 
            translates to "Nine Emotions" or "Nine Sentiments" in Indian aesthetic theory. This ancient concept, 
            rooted in the <em>Natya Shastra</em> (the foundational text of Indian performing arts written by 
            Bharata Muni around 200 BCE), forms the emotional foundation of Indian classical music, dance, and drama.
          </p>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Each Rasa represents a distinct emotional state that artists strive to evoke in their audience. 
            These emotions are not just feelings but complete aesthetic experiences that connect the performer, 
            the art form, and the audience in a profound emotional journey.
          </p>
        </motion.div>

        {/* Nine Rasas Grid */}
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          The Nine Emotional States
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(NAVARASAS).map(([key, rasa], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
              style={{
                borderTop: `4px solid ${rasa.color}`
              }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{rasa.emoji}</div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {rasa.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {rasa.sanskrit}
                </p>
                <p 
                  className="text-lg font-semibold mb-4"
                  style={{ color: rasa.color }}
                >
                  {rasa.english}
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {rasa.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {rasa.characteristics.map((char, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NavarasaExplanation
