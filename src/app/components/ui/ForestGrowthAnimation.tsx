import { motion } from 'motion/react';
import { Trees, Sparkles } from 'lucide-react';

export interface ForestGrowthAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function ForestGrowthAnimation({ isVisible, onComplete }: ForestGrowthAnimationProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
    >
      <div className="relative">
        {/* Animated Trees */}
        <div className="flex items-end justify-center gap-4">
          {['🌱', '🌿', '🌳', '🌲'].map((tree, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.2,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="text-6xl"
            >
              {tree}
            </motion.div>
          ))}
        </div>

        {/* Sparkles around the growing forest */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0, 1, 0] }}
              transition={{
                delay: 0.8 + i * 0.1,
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2
              }}
              style={{
                top: `${Math.random() * 100 - 50}%`,
                left: `${Math.random() * 200 - 100}%`,
              }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          ))}
        </motion.div>

        {/* Success Message */}
        <motion.div
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-white rounded-2xl shadow-xl px-6 py-3">
            <p className="font-bold text-green-600 text-lg">Forest Growing! 🌳</p>
            <p className="text-sm text-neutral-600">Great job staying consistent!</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}