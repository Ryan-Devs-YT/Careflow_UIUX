import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  from?: any;
  to?: any;
  onLetterAnimationComplete?: () => void;
  // Ignored or mocked props to match requested API
  ease?: string;
  splitType?: string;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  showCallback?: boolean;
}

const SplitText = ({
  text,
  className = '',
  delay = 0,
  duration = 0.5,
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  onLetterAnimationComplete,
  textAlign = 'center'
}: SplitTextProps) => {
  // Split text into characters
  const characters = text.split('');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay / 1000 // Convert ms to s if needed, assuming user passed ms or s. usage says 50, probably ms? no, Framer uses seconds. 50ms is fast. 
        // User example: delay={50}. 50ms = 0.05s.
      }
    }
  };

  const itemVariants = {
    hidden: from,
    visible: {
      ...to,
      transition: {
        duration: duration,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className={`${className} inline-block`}
      style={{ textAlign }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={onLetterAnimationComplete}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default SplitText;
