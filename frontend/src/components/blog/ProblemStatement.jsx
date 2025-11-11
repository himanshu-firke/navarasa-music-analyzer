import { motion } from 'framer-motion'
import { Target, HelpCircle } from 'lucide-react'

const ProblemStatement = () => {
  const problems = [
    {
      question: "Can we identify what emotions are evoked by music?",
      description: "Understanding the emotional impact of musical elements through AI and machine learning algorithms to map sound patterns to human emotions."
    },
    {
      question: "How do different cultures perceive musical emotions?",
      description: "Exploring cultural frameworks like Nava Rasa in Indian classical music and their universal applicability in emotion recognition systems."
    },
    {
      question: "Can AI understand emotional depth like humans do?",
      description: "Bridging the gap between human perception and machine learning through computer vision, deep learning, and real-time emotion analysis."
    },
    {
      question: "How can technology preserve ancient musical wisdom?",
      description: "Combining traditional Indian classical music theory with modern AI to create culturally aware and emotionally intelligent systems."
    }
  ]

  return (
    <section id="problem" data-section="problem" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Target className="w-12 h-12 text-pink-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              The Challenge
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Before diving into our solution, let's explore the fundamental questions that drive this research
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-l-4 border-pink-500 hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <HelpCircle className="w-10 h-10 text-pink-500 mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {problem.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProblemStatement
