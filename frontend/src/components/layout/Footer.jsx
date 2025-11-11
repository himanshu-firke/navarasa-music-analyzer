import { Music, Github, Linkedin, Mail, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Navarasa Music Analyzer
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 max-w-md">
              AI-powered music emotion analyzer based on the nine classical Indian Navarasas.
              Bridging ancient cultural theory with modern Machine Learning.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href="https://github.com/himanshu-firke/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:scale-110 transition-transform"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/himanshufirke/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:scale-110 transition-transform"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:himanshufirke04@gmail.com"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:scale-110 transition-transform"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a href="/analyze" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">
                  Analyze Music
                </a>
              </li>
              <li>
                <a href="/history" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">
                  History
                </a>
              </li>
              <li>
                <a href="/compare" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">
                  Compare Songs
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Resources</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a href="#" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">
                  Research Paper
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-1 flex-wrap">
            <span>Made with</span>
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-current" />
            <span>by Himanshu Ganesh Firke © {currentYear}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
