import { motion } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onGetStarted, onSkip }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-healing-sage-100 via-neutral-50 to-warm-comfort-100 flex flex-col items-center justify-between p-8 pb-12">
      {/* Logo and Animation */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="w-24 h-24 bg-healing-sage-500 rounded-[24px] flex items-center justify-center shadow-lg">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Garden Illustration */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <svg width="280" height="160" viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sky */}
            <rect width="280" height="160" fill="url(#skyGradient)" />
            <defs>
              <linearGradient id="skyGradient" x1="140" y1="0" x2="140" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E8F5E9" />
                <stop offset="1" stopColor="#C8E6C9" />
              </linearGradient>
            </defs>
            
            {/* Ground */}
            <path d="M0 120 Q70 110 140 120 T280 120 L280 160 L0 160 Z" fill="#7CB342" opacity="0.6" />
            <path d="M0 135 Q70 125 140 135 T280 135 L280 160 L0 160 Z" fill="#689F38" opacity="0.8" />
            
            {/* Plants */}
            <g opacity="0.9">
              {/* Left flower */}
              <circle cx="60" cy="100" r="8" fill="#E91E63" />
              <circle cx="52" cy="106" r="8" fill="#E91E63" />
              <circle cx="68" cy="106" r="8" fill="#E91E63" />
              <circle cx="56" cy="92" r="8" fill="#E91E63" />
              <circle cx="64" cy="92" r="8" fill="#E91E63" />
              <circle cx="60" cy="100" r="5" fill="#FFC107" />
              <line x1="60" y1="110" x2="60" y2="135" stroke="#7CB342" strokeWidth="3" />
              
              {/* Center tree */}
              <rect x="134" y="90" width="12" height="45" rx="2" fill="#8D6E63" />
              <path d="M140 90 L115 70 L122 70 L110 50 L140 50 L170 50 L158 70 L165 70 Z" fill="#66BB6A" />
              
              {/* Right flower */}
              <circle cx="220" cy="105" r="8" fill="#9C27B0" />
              <circle cx="212" cy="111" r="8" fill="#9C27B0" />
              <circle cx="228" cy="111" r="8" fill="#9C27B0" />
              <circle cx="216" cy="97" r="8" fill="#9C27B0" />
              <circle cx="224" cy="97" r="8" fill="#9C27B0" />
              <circle cx="220" cy="105" r="5" fill="#FFC107" />
              <line x1="220" y1="115" x2="220" y2="135" stroke="#7CB342" strokeWidth="3" />
            </g>
          </svg>
        </motion.div>

        {/* Text Content */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-neutral-700 mb-4">
            Welcome to CareFlow
          </h1>
          <p className="text-xl text-neutral-600 max-w-md">
            Healthcare that moves with your life
          </p>
        </motion.div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="w-full max-w-md space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <PrimaryButton onClick={onGetStarted} fullWidth>
          Get Started
        </PrimaryButton>
        
        <button
          onClick={onSkip}
          className="w-full text-neutral-500 text-sm py-2 hover:text-neutral-700 transition-colors"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
