import { motion } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { User, Camera } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface QuickSetupScreenProps {
  onContinue: (data: SetupData) => void;
  onSkip: () => void;
}

export interface SetupData {
  name: string;
  profilePhoto?: string;
}

export function QuickSetupScreen({ onContinue, onSkip }: QuickSetupScreenProps) {
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleNameSubmit = () => {
    if (name.trim()) {
      setStep(2);
    }
  };

  const handlePhotoSkip = () => {
    setStep(3);
  };

  const handleComplete = () => {
    onContinue({ name });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col p-6 pb-32">
      {/* Progress Indicator */}
      <motion.div
        className="max-w-2xl mx-auto w-full mt-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-600">
            Step {step} of {totalSteps}
          </span>
          <button
            onClick={onSkip}
            className="text-sm text-healing-sage-600 hover:text-healing-sage-700 font-medium"
          >
            Skip setup
          </button>
        </div>
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-healing-sage-500 rounded-full"
            initial={{ width: '25%' }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Step 1: Name */}
      {step === 1 && (
        <motion.div
          className="flex-1 max-w-2xl mx-auto w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="mb-8">
            <div className="w-16 h-16 bg-healing-sage-100 rounded-2xl flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-healing-sage-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-700 mb-2">
              What's your name?
            </h1>
            <p className="text-neutral-600">
              We'll use this to personalize your experience
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base mb-2 block">
                Your name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 text-lg rounded-xl border-2"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
            </div>
          </div>

          <div className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto space-y-3">
            <PrimaryButton
              onClick={handleNameSubmit}
              fullWidth
              disabled={!name.trim()}
            >
              Next
            </PrimaryButton>
            <button
              onClick={() => setStep(2)}
              className="w-full text-neutral-500 text-sm py-2 hover:text-neutral-700 transition-colors"
            >
              Skip this step
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Profile Photo (Optional) */}
      {step === 2 && (
        <motion.div
          className="flex-1 max-w-2xl mx-auto w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="mb-8">
            <div className="w-16 h-16 bg-healing-sage-100 rounded-2xl flex items-center justify-center mb-6">
              <Camera className="w-8 h-8 text-healing-sage-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-700 mb-2">
              Add a profile photo
            </h1>
            <p className="text-neutral-600">
              Optional: Help family members recognize your profile
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <button className="w-32 h-32 rounded-full bg-neutral-200 border-2 border-dashed border-neutral-400 flex items-center justify-center hover:bg-neutral-300 transition-colors">
              <Camera className="w-12 h-12 text-neutral-500" />
            </button>
          </div>

          <div className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto space-y-3">
            <PrimaryButton onClick={handlePhotoSkip} fullWidth>
              Continue
            </PrimaryButton>
            <button
              onClick={handlePhotoSkip}
              className="w-full text-neutral-500 text-sm py-2 hover:text-neutral-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Add First Medication (Optional) */}
      {step === 3 && (
        <motion.div
          className="flex-1 max-w-2xl mx-auto w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="mb-8">
            <div className="text-5xl mb-6">💊</div>
            <h1 className="text-3xl font-bold text-neutral-700 mb-2">
              Add your first medication?
            </h1>
            <p className="text-neutral-600">
              You can do this later, or start now to get the full experience
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <button className="w-full p-5 bg-white rounded-xl border-2 border-neutral-200 hover:border-healing-sage-300 hover:bg-healing-sage-50 transition-all text-left group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-healing-sage-100 rounded-xl flex items-center justify-center group-hover:bg-healing-sage-200 transition-colors">
                  <Camera className="w-6 h-6 text-healing-sage-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-700 mb-1">
                    Take a photo
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Snap a picture of your medication
                  </p>
                </div>
              </div>
            </button>

            <button className="w-full p-5 bg-white rounded-xl border-2 border-neutral-200 hover:border-healing-sage-300 hover:bg-healing-sage-50 transition-all text-left group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-healing-sage-100 rounded-xl flex items-center justify-center group-hover:bg-healing-sage-200 transition-colors">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-700 mb-1">
                    Search by name
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Find your medication in our database
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto space-y-3">
            <button
              onClick={() => setStep(4)}
              className="w-full text-neutral-500 text-sm py-2 hover:text-neutral-700 transition-colors"
            >
              I'll do this later
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Placeholder for next step - would lead to success */}
      {step === 4 && (
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-neutral-700 mb-2">
              Almost there!
            </h1>
            <p className="text-neutral-600 mb-8">
              Let's get you started
            </p>
            <PrimaryButton onClick={handleComplete}>
              Complete Setup
            </PrimaryButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}
