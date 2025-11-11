import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

const ReferencesSection = () => {
  const references = [
    "Prof. Priyadarshi Patnaik, Rasa in Aesthetics: An Application of Rasa Theory to Modern Western Literature.",
    "Patrik N. Juslin and Petri Laukka, Expression, Perception, and Induction of Musical Emotions: A Review and a Questionnaire Study of Everyday Listening, Journal of New Music Research, Vol. 33, No. 3, pp. 217–238, 2004.",
    "V.N. Bhatkande. Hindusthani Sangeet Paddhati. Sangeet Karyalaya, 1920-1979.",
    "Peer to Peer Multimedia Real-Time Communication System based on WebRTC Technology",
    "Sharangadev, Sangeet Ratnakara, 1210–1247.",
    "Russell's Circumplex Model of Affect",
    "Monojit Choudhury, Pradip taRanjan Ray, Measuring Similarities across Musical Compositions: An Approach Based on the Raag Paradigm, Journal of the ITC-SRA, vol.17 2003.",
    "Anirban Patranabis et al., Measurement of Emotion induced by Hindusthani Music –A Human response and EEG study, Journal of ITC Sageet Research Academy –Ninaad, Vol. 26-27, December 2013.",
    "Asmita Chatterji and Dana Ganu, A Framework for Understanding the Relation Between Music And Emotions, Journal of ITC Sangeet Research Academy, Vol. 26-27, December, 2013.",
    "Alicja A Wieczorkowska, Ashoke Kumar Datta, Ranjan Sengupta, Nityananda Dey, and Bhaswati Mukherjee, On Search for Emotion in Hindusthani Vocal Music, Advances in Music Information Retrieval, SCI 274, pp. 285–304, Springer-Verlag Berlin Heidelberg, 2010.",
    "Application of the Navarasa Theory in Architecture",
    "Parag Chordia and Alex Rae, Understanding emotion in raag: An empirical study of listener responses, Computer Music Modeling and Retrieval, Sense of Sounds, pp. 110–124, 2009.",
    "Analysis of Features for Mood Detection in North Indian Classical Music-A Literature Review",
    "Tao Li, Mitsunori Ogihara, 2004. Content-Based Music Similarity Search and Emotion Detection, International conference on Acoustics, Speech and Signal Processing (ICASSP 2004), 705-708.",
    "Thayer's Model of Mood",
    "Hiba Ahsan, Vijay Kumar and C.V. Jawahar, Multi-Label Annotation of Music, IEEE 2015",
    "L. Lu, D. Liu, and H. J. Zhang, Automatic mood detection and tracking of music audio signals, IEEE Transactions on Audio, Speech and Language Processing, vol. 14, no. 1, pp.5–18, 2006",
    "D. Liu, L. Lu and H-J. Zang, Automatic Mood Detection from Acoustic Music Data, ISMIR 2003",
    "G. Peeters, A generic training and classification system for MIREX08 classification tasks: Audio music mood, audio genre, audio artist and audio tag, MIREX 2008",
    "Analysis of Features for Mood Detection in North Indian Classical Music-A Literature Review"
  ]

  return (
    <section id="references" data-section="references" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <FileText className="w-10 h-10 text-pink-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              References
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl">
            <ol className="space-y-4">
              {references.map((reference, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02 }}
                  className="flex gap-4 text-gray-700 dark:text-gray-300"
                >
                  <span className="flex-shrink-0 font-bold text-pink-600 dark:text-pink-400">
                    [{index + 1}]
                  </span>
                  <span className="leading-relaxed">{reference}</span>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Copyright © 2025</strong> Himanshu Ganesh Firke - Navarasa Music Emotion Analyzer
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              This project is open source and available for educational and research purposes. The code and documentation 
              are provided as-is to promote learning and advancement in music emotion recognition and AI applications.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ReferencesSection
