import { motion } from 'framer-motion'
import { useState } from 'react'

const BlogImage = ({ 
  src, 
  alt, 
  caption, 
  width = 'full', 
  rounded = true,
  shadow = true,
  zoom = true 
}) => {
  const [isZoomed, setIsZoomed] = useState(false)

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'w-full'
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`my-8 ${widthClasses[width]} mx-auto`}
    >
      <div 
        className={`relative overflow-hidden ${rounded ? 'rounded-2xl' : ''} ${shadow ? 'shadow-xl' : ''} ${zoom ? 'cursor-zoom-in' : ''}`}
        onClick={() => zoom && setIsZoomed(true)}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto transition-transform duration-300 ${zoom ? 'hover:scale-105' : ''}`}
          loading="lazy"
        />
      </div>
      
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400 italic">
          {caption}
        </figcaption>
      )}

      {/* Zoom Modal */}
      {isZoomed && zoom && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={src}
            alt={alt}
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </motion.figure>
  )
}

export default BlogImage
