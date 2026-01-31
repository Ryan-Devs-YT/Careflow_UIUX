import { motion } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { ArrowLeft, Clock, Package, AlertCircle, User, Building2, FileText, Trash2, Edit } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface MedicationDetailsProps {
  medication: {
    id: string;
    name: string;
    dosage: string;
    photo?: string;
    schedule: string[];
    frequency: string;
    supply?: number;
    refillDate?: string;
    doctor?: string;
    pharmacy?: string;
    purpose?: string;
    notes?: string;
    sideEffects?: string[];
    interactions?: string[];
  };
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOrderRefill?: () => void;
  mode?: 'simplified' | 'balanced';
}

export function MedicationDetails({
  medication,
  onBack,
  onEdit,
  onDelete,
  onOrderRefill,
  mode = 'simplified',
}: MedicationDetailsProps) {
  const isSimplified = mode === 'simplified';
  const daysRemaining = medication.supply ? Math.floor(medication.supply / medication.schedule.length) : null;

  return (
    <div className="min-h-screen bg-neutral-50 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-healing-sage-500 to-healing-sage-600 text-white p-6 rounded-b-[32px] shadow-lg mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-4">
          {/* Medication Photo */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex-shrink-0 overflow-hidden">
            {medication.photo ? (
              <ImageWithFallback
                src={medication.photo}
                alt={medication.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                💊
              </div>
            )}
          </div>

          {/* Title Info */}
          <div className="flex-1">
            <h1 className={`${isSimplified ? 'text-2xl' : 'text-xl'} font-bold mb-1`}>
              {medication.name}
            </h1>
            <p className="text-healing-sage-100 text-lg">
              {medication.dosage}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Dosage & Schedule Card */}
        <motion.div
          className="bg-white rounded-[20px] p-5 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-healing-sage-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-healing-sage-600" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-700">
              Dosage & Schedule
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Frequency</p>
              <p className="text-base font-medium text-neutral-700">
                {medication.frequency}
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-500 mb-2">Times</p>
              <div className="flex flex-wrap gap-2">
                {medication.schedule.map((time, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-healing-sage-100 text-healing-sage-700 rounded-lg font-medium"
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Supply Card */}
        {medication.supply !== undefined && (
          <motion.div
            className="bg-white rounded-[20px] p-5 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-info-light rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-info-main" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-700">
                Current Supply
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">
                  {medication.supply} pills remaining
                </span>
                {daysRemaining !== null && (
                  <span className="text-sm font-medium text-neutral-700">
                    ~{daysRemaining} days
                  </span>
                )}
              </div>
              <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    medication.supply > 20
                      ? 'bg-success-main'
                      : medication.supply > 10
                      ? 'bg-warning-main'
                      : 'bg-error-main'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((medication.supply / 30) * 100, 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>

            {medication.refillDate && (
              <p className="text-sm text-neutral-600 mb-3">
                Refill by <span className="font-semibold">{medication.refillDate}</span>
              </p>
            )}

            {onOrderRefill && (
              <PrimaryButton onClick={onOrderRefill} fullWidth mode={mode}>
                Order Refill
              </PrimaryButton>
            )}
          </motion.div>
        )}

        {/* Why You Take This Card */}
        {medication.purpose && (
          <motion.div
            className="bg-white rounded-[20px] p-5 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-warm-comfort-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-warm-comfort-500" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-700">
                Why You Take This
              </h2>
            </div>

            <p className="text-neutral-700 leading-relaxed">
              {medication.purpose}
            </p>

            {medication.doctor && (
              <div className="mt-3 pt-3 border-t border-neutral-200">
                <p className="text-sm text-neutral-500">Prescribed by</p>
                <p className="text-base font-medium text-neutral-700">
                  {medication.doctor}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Important Notes Card */}
        {(medication.notes || medication.sideEffects || medication.interactions) && (
          <motion.div
            className="bg-white rounded-[20px] p-5 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-warning-light rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-warning-dark" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-700">
                Important Notes
              </h2>
            </div>

            <div className="space-y-3">
              {medication.notes && (
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Instructions</p>
                  <p className="text-neutral-700">{medication.notes}</p>
                </div>
              )}

              {medication.sideEffects && medication.sideEffects.length > 0 && (
                <div>
                  <p className="text-sm text-neutral-500 mb-2">Watch for</p>
                  <ul className="space-y-1">
                    {medication.sideEffects.map((effect, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="text-warning-main mt-0.5">•</span>
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {medication.interactions && medication.interactions.length > 0 && (
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500 mb-2">Interactions</p>
                  <ul className="space-y-1">
                    {medication.interactions.map((interaction, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="text-error-main mt-0.5">•</span>
                        <span>{interaction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Pharmacy Info */}
        {medication.pharmacy && (
          <motion.div
            className="bg-white rounded-[20px] p-5 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Pharmacy</p>
                <p className="text-base font-medium text-neutral-700">
                  {medication.pharmacy}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="pt-4 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={onEdit}
            className="w-full h-12 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Edit className="w-5 h-5" />
            Edit Medication
          </button>

          <button
            onClick={onDelete}
            className="w-full h-12 bg-error-light hover:bg-error-main/20 text-error-dark rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Remove from List
          </button>
        </motion.div>
      </div>
    </div>
  );
}
