import { motion } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { Camera, FileText, Search, Mic, ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

type AddMethod = 'photo' | 'scan' | 'search' | 'voice' | null;
type FlowStep = 'method' | 'capture' | 'processing' | 'confirmation' | 'schedule' | 'details' | 'success';

interface AddMedicationFlowProps {
  onComplete: (medication: MedicationData) => void;
  onCancel: () => void;
  mode?: 'simplified' | 'balanced';
}

export interface MedicationData {
  name: string;
  dosage: string;
  times: string[];
  frequency: string;
  doctor?: string;
  pharmacy?: string;
  supply?: number;
  notes?: string;
}

export function AddMedicationFlow({ onComplete, onCancel, mode = 'simplified' }: AddMedicationFlowProps) {
  const [step, setStep] = useState<FlowStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<AddMethod>(null);
  const [medicationData, setMedicationData] = useState<Partial<MedicationData>>({
    name: '',
    dosage: '',
    times: [],
    frequency: 'daily',
  });

  // Method Selection
  if (step === 'method') {
    const methods = [
      {
        id: 'photo' as AddMethod,
        icon: <Camera className="w-8 h-8" />,
        title: 'Take a photo of the pill',
        description: 'Quick and easy identification',
      },
      {
        id: 'scan' as AddMethod,
        icon: <FileText className="w-8 h-8" />,
        title: 'Scan prescription label',
        description: 'Auto-fill all the details',
      },
      {
        id: 'search' as AddMethod,
        icon: <Search className="w-8 h-8" />,
        title: 'Search by name',
        description: 'Find in our database',
      },
      {
        id: 'voice' as AddMethod,
        icon: <Mic className="w-8 h-8" />,
        title: 'Tell me about it',
        description: 'Speak the medication name',
      },
    ];

    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col p-6 pb-32">
        <motion.div
          className="mb-8 mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-neutral-700 mb-2">
            Add Medication
          </h1>
          <p className="text-neutral-600">
            How would you like to add this medication?
          </p>
        </motion.div>

        <div className="flex-1 space-y-4 max-w-2xl mx-auto w-full">
          {methods.map((method, index) => (
            <motion.button
              key={method.id}
              onClick={() => {
                setSelectedMethod(method.id);
                // Simulate going to next step
                setTimeout(() => {
                  if (method.id === 'search') {
                    setStep('confirmation');
                  } else {
                    setStep('processing');
                    setTimeout(() => setStep('confirmation'), 2000);
                  }
                }, 300);
              }}
              className="w-full h-[72px] bg-white rounded-[16px] border-2 border-neutral-200 hover:border-healing-sage-300 hover:bg-healing-sage-50 transition-all shadow-sm hover:shadow-md text-left group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-full flex items-center gap-4 px-6">
                <div className="w-14 h-14 bg-healing-sage-100 rounded-xl flex items-center justify-center text-healing-sage-600 group-hover:bg-healing-sage-200 transition-colors flex-shrink-0">
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-700 mb-0.5">
                    {method.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {method.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Processing
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-24 h-24 bg-healing-sage-100 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Camera className="w-12 h-12 text-healing-sage-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-neutral-700 mb-2">
            Identifying medication...
          </h2>
          <p className="text-neutral-600">
            Just a moment
          </p>
        </motion.div>
      </div>
    );
  }

  // Confirmation
  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col p-6 pb-32">
        <motion.div
          className="mb-8 mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setStep('method')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-neutral-700 mb-2">
            Is this correct?
          </h1>
        </motion.div>

        <div className="flex-1 max-w-2xl mx-auto w-full">
          {/* Medication Preview */}
          <motion.div
            className="bg-white rounded-[20px] p-6 shadow-lg mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-6xl">💊</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-700 mb-1">
                Metformin
              </h2>
              <p className="text-neutral-600">
                500mg tablets
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-healing-sage-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-healing-sage-600" />
                </div>
                <span className="text-neutral-600">Common diabetes medication</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-healing-sage-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-healing-sage-600" />
                </div>
                <span className="text-neutral-600">Take with food</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PrimaryButton
              onClick={() => {
                setMedicationData({ ...medicationData, name: 'Metformin', dosage: '500mg' });
                setStep('schedule');
              }}
              fullWidth
            >
              Yes, that's it
            </PrimaryButton>
            <PrimaryButton
              onClick={() => setStep('method')}
              variant="secondary"
              fullWidth
            >
              No, let me search
            </PrimaryButton>
          </motion.div>
        </div>
      </div>
    );
  }

  // Schedule Setup
  if (step === 'schedule') {
    const [frequency, setFrequency] = useState<'once' | 'twice' | 'three' | 'custom'>('twice');
    const [times, setTimes] = useState<string[]>(['08:00', '20:00']);

    const frequencyOptions = [
      { id: 'once' as const, label: 'Once daily', defaultTimes: ['08:00'] },
      { id: 'twice' as const, label: 'Twice daily', defaultTimes: ['08:00', '20:00'] },
      { id: 'three' as const, label: 'Three times daily', defaultTimes: ['08:00', '14:00', '20:00'] },
      { id: 'custom' as const, label: 'Custom schedule', defaultTimes: [] },
    ];

    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col p-6 pb-32">
        <motion.div
          className="mb-8 mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setStep('confirmation')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-neutral-700 mb-2">
            When do you take Metformin?
          </h1>
          <p className="text-neutral-600">
            Set up your medication schedule
          </p>
        </motion.div>

        <div className="flex-1 max-w-2xl mx-auto w-full space-y-6">
          {/* Frequency Options */}
          <div className="space-y-3">
            {frequencyOptions.map((option, index) => (
              <motion.button
                key={option.id}
                onClick={() => {
                  setFrequency(option.id);
                  setTimes(option.defaultTimes);
                }}
                className={`
                  w-full p-5 rounded-xl border-2 transition-all text-left
                  ${
                    frequency === option.id
                      ? 'bg-healing-sage-50 border-healing-sage-500'
                      : 'bg-white border-neutral-200 hover:border-healing-sage-300'
                  }
                `}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-neutral-700">
                    {option.label}
                  </span>
                  <div
                    className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${
                      frequency === option.id
                        ? 'border-healing-sage-500 bg-healing-sage-500'
                        : 'border-neutral-300'
                    }
                  `}
                  >
                    {frequency === option.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Time Pickers */}
          {frequency !== 'custom' && times.length > 0 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {times.map((time, index) => {
                const labels = ['Morning', 'Afternoon', 'Evening'];
                return (
                  <div key={index}>
                    <Label className="mb-2 block">
                      {labels[index] || `Time ${index + 1}`}
                    </Label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => {
                        const newTimes = [...times];
                        newTimes[index] = e.target.value;
                        setTimes(newTimes);
                      }}
                      className="h-14 text-lg rounded-xl"
                    />
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>

        <motion.div
          className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PrimaryButton
            onClick={() => {
              setMedicationData({ ...medicationData, times, frequency: frequency });
              setStep('details');
            }}
            fullWidth
          >
            Continue
          </PrimaryButton>
        </motion.div>
      </div>
    );
  }

  // Additional Details (Optional)
  if (step === 'details') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col p-6 pb-32">
        <motion.div
          className="mb-8 mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setStep('schedule')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-neutral-700 mb-2">
            A few more details
          </h1>
          <p className="text-neutral-600">
            All optional - skip if you'd like
          </p>
        </motion.div>

        <div className="flex-1 max-w-2xl mx-auto w-full space-y-4">
          <div>
            <Label htmlFor="doctor">Prescribing Doctor</Label>
            <Input
              id="doctor"
              placeholder="Dr. Smith"
              className="h-12 rounded-xl mt-2"
              onChange={(e) =>
                setMedicationData({ ...medicationData, doctor: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="pharmacy">Pharmacy</Label>
            <Input
              id="pharmacy"
              placeholder="CVS Pharmacy"
              className="h-12 rounded-xl mt-2"
              onChange={(e) =>
                setMedicationData({ ...medicationData, pharmacy: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="supply">Current Supply (pills remaining)</Label>
            <Input
              id="supply"
              type="number"
              placeholder="30"
              className="h-12 rounded-xl mt-2"
              onChange={(e) =>
                setMedicationData({ ...medicationData, supply: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              placeholder="Any special instructions..."
              className="w-full h-24 px-4 py-3 rounded-xl border-2 border-neutral-300 focus:border-healing-sage-500 focus:outline-none resize-none mt-2"
              onChange={(e) =>
                setMedicationData({ ...medicationData, notes: e.target.value })
              }
            />
          </div>
        </div>

        <motion.div
          className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PrimaryButton
            onClick={() => setStep('success')}
            fullWidth
          >
            Save Medication
          </PrimaryButton>
          <button
            onClick={() => setStep('success')}
            className="w-full text-neutral-500 text-sm py-2 hover:text-neutral-700 transition-colors"
          >
            Skip for now
          </button>
        </motion.div>
      </div>
    );
  }

  // Success
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healing-sage-100 via-neutral-50 to-warm-comfort-100 flex flex-col items-center justify-center p-6">
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="w-24 h-24 bg-success-main rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-700 mb-2">
            All set!
          </h1>
          <p className="text-neutral-600 text-lg">
            We'll remind you at {medicationData.times?.[0] || '8:00 AM'}
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-neutral-700 mb-3">
            Quick Tip 💡
          </h3>
          <p className="text-sm text-neutral-600">
            Swipe left on any medication to edit or remove it from your list
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-md space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PrimaryButton
            onClick={() => {
              // Create medication with all collected data
              const newMedication: MedicationData = {
                name: medicationData.name || 'Metformin',
                dosage: medicationData.dosage || '500mg',
                times: medicationData.times || ['08:00', '20:00'],
                frequency: medicationData.frequency || 'twice daily',
                doctor: medicationData.doctor,
                pharmacy: medicationData.pharmacy,
                supply: medicationData.supply,
                notes: medicationData.notes,
              };
              onComplete(newMedication);
            }}
            fullWidth
          >
            Go to Home
          </PrimaryButton>
          <PrimaryButton
            onClick={() => {
              setStep('method');
              setMedicationData({
                name: '',
                dosage: '',
                times: [],
                frequency: 'daily',
              });
            }}
            variant="secondary"
            fullWidth
          >
            Add Another Medication
          </PrimaryButton>
        </motion.div>
      </div>
    );
  }

  return null;
}
