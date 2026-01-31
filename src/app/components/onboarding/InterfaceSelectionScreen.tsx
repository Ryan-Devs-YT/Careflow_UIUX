import { motion } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { Maximize2, LayoutGrid, Sparkles } from 'lucide-react';
import { useState } from 'react';

export type InterfaceMode = 'simplified' | 'balanced' | 'smart';

interface InterfaceSelectionScreenProps {
  onContinue: (mode: InterfaceMode) => void;
}

export function InterfaceSelectionScreen({ onContinue }: InterfaceSelectionScreenProps) {
  const [selectedMode, setSelectedMode] = useState<InterfaceMode | null>(null);

  const options = [
    {
      id: 'simplified' as InterfaceMode,
      icon: <Maximize2 className="w-12 h-12" />,
      title: 'Simple & Clear',
      description: 'Perfect for straightforward medication management',
      color: 'bg-healing-sage-100 border-healing-sage-300',
      activeColor: 'border-healing-sage-500 ring-4 ring-healing-sage-200',
    },
    {
      id: 'balanced' as InterfaceMode,
      icon: <LayoutGrid className="w-12 h-12" />,
      title: 'Complete & Organized',
      description: 'Great for managing multiple profiles',
      color: 'bg-info-light border-info-main',
      activeColor: 'border-info-main ring-4 ring-info-light',
    },
    {
      id: 'smart' as InterfaceMode,
      icon: <Sparkles className="w-12 h-12" />,
      title: 'Smart Mode',
      description: "We'll adapt based on how you use the app",
      color: 'bg-warm-comfort-100 border-warm-comfort-400',
      activeColor: 'border-warm-comfort-500 ring-4 ring-warm-comfort-200',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col p-6 pb-32">
      {/* Header */}
      <motion.div
        className="text-center mb-8 mt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-neutral-700 mb-2">
          Choose your experience
        </h1>
        <p className="text-neutral-600">
          Select the interface that works best for you
        </p>
      </motion.div>

      {/* Options */}
      <div className="flex-1 space-y-4 max-w-2xl mx-auto w-full">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            onClick={() => setSelectedMode(option.id)}
            className={`
              w-full p-6 rounded-[20px] border-2
              ${option.color}
              ${selectedMode === option.id ? option.activeColor : ''}
              transition-all duration-200
              hover:shadow-lg
              text-left
            `}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-16 h-16 rounded-2xl 
                ${selectedMode === option.id ? 'bg-white' : 'bg-white/50'}
                flex items-center justify-center text-neutral-700
                transition-colors duration-200
              `}>
                {option.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neutral-700 mb-1">
                  {option.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Radio indicator */}
              <div className={`
                flex-shrink-0 w-6 h-6 rounded-full border-2
                ${selectedMode === option.id 
                  ? 'border-healing-sage-500 bg-healing-sage-500' 
                  : 'border-neutral-300 bg-white'
                }
                flex items-center justify-center
                transition-all duration-200
              `}>
                {selectedMode === option.id && (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                )}
              </div>
            </div>

            {/* Preview thumbnails could go here */}
          </motion.button>
        ))}
      </div>

      {/* Note */}
      <motion.p
        className="text-center text-sm text-neutral-500 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        You can change this anytime in settings
      </motion.p>

      {/* Continue Button */}
      <motion.div
        className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <PrimaryButton
          onClick={() => selectedMode && onContinue(selectedMode)}
          fullWidth
          disabled={!selectedMode}
        >
          Continue
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
