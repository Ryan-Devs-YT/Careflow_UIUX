import { motion } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { Sparkles } from 'lucide-react';

interface SuccessScreenProps {
  userName?: string;
  onGoToHome: () => void;
}

export function SuccessScreen({ userName, onGoToHome }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-healing-sage-100 via-neutral-50 to-warm-comfort-100 flex flex-col items-center justify-center p-6">
      {/* Success Animation */}
      <motion.div
        className="mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          duration: 0.8,
        }}
      >
        <div className="relative">
          {/* Main icon */}
          <div className="w-32 h-32 bg-gradient-to-br from-healing-sage-400 to-healing-sage-600 rounded-[32px] flex items-center justify-center shadow-2xl">
            <Sparkles className="w-16 h-16 text-white" />
          </div>

          {/* Confetti particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ['#7BA886', '#E8B27E', '#E91E63', '#FFC107'][i % 4],
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i / 8) * Math.PI * 2) * 100,
                y: Math.sin((i / 8) * Math.PI * 2) * 100,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 0.3,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Growing plant animation */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ground */}
          <motion.ellipse
            cx="80"
            cy="120"
            rx="60"
            ry="12"
            fill="#7CB342"
            opacity="0.3"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          />
          
          {/* Stem */}
          <motion.path
            d="M80 120 L80 60"
            stroke="#7CB342"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
          />
          
          {/* Leaves */}
          <motion.path
            d="M80 90 Q70 85 65 80"
            stroke="#7CB342"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
          />
          <motion.path
            d="M80 80 Q90 75 95 70"
            stroke="#7CB342"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          />
          
          {/* Flower petals */}
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 80 + Math.cos(rad) * 15;
            const y = 50 + Math.sin(rad) * 15;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="10"
                fill="#E91E63"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 1.3 + i * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
              />
            );
          })}
          
          {/* Flower center */}
          <motion.circle
            cx="80"
            cy="50"
            r="8"
            fill="#FFC107"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 1.8,
              type: 'spring',
              stiffness: 300,
            }}
          />
        </svg>
      </motion.div>

      {/* Text Content */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <h1 className="text-4xl font-bold text-neutral-700 mb-3">
          {userName ? `You're all set, ${userName}!` : "You're all set!"}
        </h1>
        <p className="text-xl text-neutral-600 max-w-md">
          Let's take the first step together
        </p>
      </motion.div>

      {/* Preview of what's next */}
      <motion.div
        className="bg-white rounded-2xl p-6 mb-8 max-w-md w-full border border-neutral-200 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <h3 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          What's next
        </h3>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li className="flex items-start gap-2">
            <span className="text-healing-sage-500 font-bold mt-0.5">•</span>
            <span>Add your medications and we'll help you never miss a dose</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-healing-sage-500 font-bold mt-0.5">•</span>
            <span>Get reminders at the right time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-healing-sage-500 font-bold mt-0.5">•</span>
            <span>Watch your health garden grow with every dose</span>
          </li>
        </ul>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
      >
        <PrimaryButton onClick={onGoToHome} fullWidth>
          Go to Home
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
