import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

const MethodologySection = () => {
  const methodSteps = [
    {
      label: 'A',
      title: 'Audio File Upload and Preprocessing',
      content: `The system begins by accepting audio file uploads from users in multiple formats (MP3, WAV, FLAC, OGG). 
      The frontend React application handles file validation, checking format compatibility and file size limits. Once 
      validated, the audio file is uploaded to the Node.js backend server using multipart/form-data encoding. The backend 
      stores the file temporarily and creates a unique identifier for tracking the analysis process. File validation ensures 
      only supported audio formats proceed to the analysis pipeline, protecting the system from invalid inputs.`,
      tags: ['File Upload', 'Multer', 'Audio Formats', 'Validation']
    },
    {
      label: 'B',
      title: 'Audio Feature Extraction with Librosa',
      content: `Once the audio file is received, the Python ML service uses Librosa, a comprehensive audio analysis library, 
      to extract relevant acoustic features. The system computes mel-spectrograms, MFCCs (Mel-Frequency Cepstral Coefficients), 
      chroma features, spectral contrast, and zero-crossing rate. These features capture the tonal, rhythmic, and timbral 
      characteristics of the music. Additionally, Librosa extracts tempo (beats per minute), harmonic and percussive components, 
      and spectral rolloff, which together provide a multi-dimensional representation of the audio's acoustic properties.`,
      tags: ['Librosa', 'Feature Extraction', 'MFCCs', 'Mel-Spectrogram', 'Audio Analysis']
    },
    {
      label: 'C',
      title: 'Rule-Based Emotion Scoring Engine',
      content: `Instead of a pre-trained deep learning model, the current build relies on an enhanced rule-based classifier. 
      The Librosa feature vectors feed into weighted heuristics that evaluate tempo ranges, RMS energy levels, spectral 
      brightness, zero-crossing rate, and chromatic movement. Each Navarasa has curated scoring curves that translate these 
      acoustic cues into normalized confidence values, providing interpretable and tunable predictions.`,
      tags: ['Librosa', 'Rule-Based AI', 'Feature Engineering', 'Audio Heuristics']
    },
    {
      label: 'D',
      title: 'Emotion Mapping to Nava Rasa Framework',
      content: `The weighted scores derived from Librosa features are aligned with insights from musicological research on the 
      nine Nava Rasas. For example, high tempo and bright timbre correlate with Hasya (Joy), while low tempo with gentle dynamics 
      indicates Karuna (Sadness). The system evaluates feature combinations simultaneously, assigns confidence scores to each 
      emotion, and normalizes the distribution so users can see how strongly their track expresses every rasa.`,
      tags: ['Emotion Mapping', 'Nava Rasa', 'Classification Algorithm', 'Cultural Framework']
    },
    {
      label: 'E',
      title: 'Result Aggregation and Storage',
      content: `The emotion analysis results, including the primary emotion, confidence scores for all nine emotions, and 
      extracted audio features, are aggregated and sent back to the Node.js backend. The backend stores this data in MongoDB, 
      creating a historical record of analyses. Each analysis entry includes the filename, upload timestamp, emotion distribution, 
      primary emotion, confidence level, and audio feature metadata. This persistent storage enables features like analysis 
      history viewing and multi-song comparison.`,
      tags: ['MongoDB', 'Data Persistence', 'REST API', 'Result Storage']
    },
    {
      label: 'F',
      title: 'Visualization and User Interface',
      content: `The React frontend receives the analysis results and renders them through intuitive visualizations. Using Recharts, 
      the system displays pie charts for emotion distribution and bar charts for comparative analysis. The UI shows the primary 
      emotion with its confidence score, a breakdown of all nine emotions, and audio feature statistics. Users can view their 
      analysis history, compare multiple songs side-by-side using radar charts and tables, and export results. The interface 
      provides both dark and light modes for comfortable viewing.`,
      tags: ['React', 'Recharts', 'Data Visualization', 'User Experience', 'Responsive Design']
    },
    {
      label: 'G',
      title: 'System Architecture and Scalability',
      content: `The Navarasa application follows a microservices architecture with clear separation of concerns. The React frontend 
      handles user interactions, the Node.js backend manages API requests and database operations, and the Python ML service 
      performs audio processing and emotion inference. This architecture allows independent scaling of components based on load. 
      The system uses RESTful APIs for communication between services, with proper error handling and validation at each layer. 
      CORS is configured to allow frontend-backend communication while maintaining security.`,
      tags: ['Microservices', 'REST API', 'Scalability', 'Architecture', 'Full-Stack']
    }
  ]

  return (
    <section id="methodology" data-section="methodology" className="py-16 px-4 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Brain className="w-10 h-10 text-purple-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Methodology
            </h2>
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-12">
            The Navarasa Music Emotion Analyzer employs a comprehensive methodology that integrates modern web technologies, 
            audio processing libraries, and machine learning models. The system follows a multi-stage pipeline from audio 
            file upload through feature extraction, classification, emotion mapping, and visualization. Each component is 
            carefully designed to work together, creating a seamless user experience while maintaining accuracy in emotion 
            detection based on the Nava Rasa framework.
          </p>

          <div className="space-y-8">
            {methodSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-6"
              >
                <div 
                  className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg"
                >
                  {step.label}
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {step.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-gradient-to-r from-pink-500/10 to-purple-600/10 text-pink-600 dark:text-pink-400 rounded-full text-sm font-semibold border border-pink-200 dark:border-pink-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MethodologySection
