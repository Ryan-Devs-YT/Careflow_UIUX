import { motion } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { ArrowLeft, Package, MapPin, Truck, Store, Calendar, DollarSign, Check } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface RefillMedication {
  id: string;
  name: string;
  dosage: string;
  photo?: string;
  daysRemaining: number;
  pillsRemaining: number;
  refillDueDate: string;
  pharmacy: string;
  price?: string;
}

interface RefillManagementProps {
  medications: RefillMedication[];
  onBack: () => void;
  onOrderRefill: (medicationId: string, deliveryMethod: 'pickup' | 'delivery') => void;
  mode?: 'simplified' | 'balanced';
}

export function RefillManagement({
  medications,
  onBack,
  onOrderRefill,
  mode = 'simplified',
}: RefillManagementProps) {
  const [selectedTab, setSelectedTab] = useState<'due-soon' | 'all' | 'history'>('due-soon');
  const [selectedMedication, setSelectedMedication] = useState<RefillMedication | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [showOrderModal, setShowOrderModal] = useState(false);

  const isSimplified = mode === 'simplified';

  const dueSoonMeds = medications.filter((med) => med.daysRemaining <= 7);
  const displayMedications = selectedTab === 'due-soon' ? dueSoonMeds : medications;

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'bg-error-light border-error-main text-error-dark';
    if (days <= 7) return 'bg-warning-light border-warning-main text-warning-dark';
    return 'bg-neutral-100 border-neutral-300 text-neutral-600';
  };

  const getProgressColor = (days: number) => {
    if (days <= 3) return 'bg-error-main';
    if (days <= 7) return 'bg-warning-main';
    return 'bg-success-main';
  };

  const handleOrderClick = (med: RefillMedication) => {
    setSelectedMedication(med);
    setShowOrderModal(true);
  };

  const handleConfirmOrder = () => {
    if (selectedMedication) {
      onOrderRefill(selectedMedication.id, deliveryMethod);
      setShowOrderModal(false);
      setSelectedMedication(null);
    }
  };

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

        <h1 className={`${isSimplified ? 'text-3xl' : 'text-2xl'} font-bold mb-1`}>
          Medication Refills
        </h1>
        <p className="text-healing-sage-100">
          {dueSoonMeds.length} medication{dueSoonMeds.length !== 1 ? 's' : ''} need{dueSoonMeds.length === 1 ? 's' : ''} refill soon
        </p>
      </div>

      <div className="px-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
          {[
            { id: 'due-soon' as const, label: 'Due Soon' },
            { id: 'all' as const, label: 'All' },
            { id: 'history' as const, label: 'History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`
                flex-1 py-3 rounded-lg font-medium transition-all
                ${
                  selectedTab === tab.id
                    ? 'bg-healing-sage-500 text-white shadow-md'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Medications List */}
        <div className="space-y-4">
          {displayMedications.map((med, index) => (
            <motion.div
              key={med.id}
              className="bg-white rounded-[16px] shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Photo */}
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 border-2 border-neutral-200 flex-shrink-0 overflow-hidden">
                    {med.photo ? (
                      <ImageWithFallback
                        src={med.photo}
                        alt={med.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        💊
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-neutral-700 mb-1">
                      {med.name}
                    </h3>
                    <p className="text-sm text-neutral-500 mb-2">
                      {med.dosage}
                    </p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border-2 ${getUrgencyColor(med.daysRemaining)}`}>
                      <Package className="w-3.5 h-3.5" />
                      <span>{med.daysRemaining} days remaining</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">
                      {med.pillsRemaining} pills left
                    </span>
                    <span className="text-sm font-medium text-neutral-700">
                      Refill by {med.refillDueDate}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${getProgressColor(med.daysRemaining)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((med.pillsRemaining / 30) * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + index * 0.05 }}
                    />
                  </div>
                </div>

                {/* Pharmacy Info */}
                <div className="flex items-center gap-2 mb-4 text-sm text-neutral-600">
                  <Store className="w-4 h-4" />
                  <span>{med.pharmacy}</span>
                  {med.price && (
                    <>
                      <span className="text-neutral-300">•</span>
                      <span className="font-medium">{med.price}</span>
                    </>
                  )}
                </div>

                {/* Order Button */}
                <PrimaryButton
                  onClick={() => handleOrderClick(med)}
                  fullWidth
                  mode={mode}
                >
                  Order Refill
                </PrimaryButton>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {displayMedications.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-success-main" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              All caught up!
            </h3>
            <p className="text-neutral-600">
              No medications need refills right now
            </p>
          </motion.div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedMedication && (
        <motion.div
          className="fixed inset-0 bg-neutral-800/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowOrderModal(false)}
        >
          <motion.div
            className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-healing-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-healing-sage-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-700 mb-1">
                Order Refill
              </h2>
              <p className="text-neutral-600">
                {selectedMedication.name} • {selectedMedication.dosage}
              </p>
            </div>

            {/* Delivery Method */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                Delivery Method
              </h3>
              
              <div className="space-y-3">
                {/* Pickup Option */}
                <button
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all text-left
                    ${
                      deliveryMethod === 'pickup'
                        ? 'bg-healing-sage-50 border-healing-sage-500'
                        : 'bg-white border-neutral-200 hover:border-healing-sage-300'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                      ${deliveryMethod === 'pickup' ? 'bg-healing-sage-100' : 'bg-neutral-100'}
                    `}>
                      <Store className="w-5 h-5 text-healing-sage-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-700 mb-1">
                        Pickup at Pharmacy
                      </h4>
                      <p className="text-sm text-neutral-600">
                        Ready in 2 hours • {selectedMedication.pharmacy}
                      </p>
                      {selectedMedication.price && (
                        <p className="text-sm font-medium text-neutral-700 mt-1">
                          {selectedMedication.price}
                        </p>
                      )}
                    </div>
                    <div className={`
                      flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1
                      ${
                        deliveryMethod === 'pickup'
                          ? 'border-healing-sage-500 bg-healing-sage-500'
                          : 'border-neutral-300'
                      }
                    `}>
                      {deliveryMethod === 'pickup' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Delivery Option */}
                <button
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all text-left
                    ${
                      deliveryMethod === 'delivery'
                        ? 'bg-healing-sage-50 border-healing-sage-500'
                        : 'bg-white border-neutral-200 hover:border-healing-sage-300'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                      ${deliveryMethod === 'delivery' ? 'bg-healing-sage-100' : 'bg-neutral-100'}
                    `}>
                      <Truck className="w-5 h-5 text-healing-sage-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-700 mb-1">
                        Home Delivery
                      </h4>
                      <p className="text-sm text-neutral-600">
                        Arrives in 1-2 days • Free shipping
                      </p>
                      {selectedMedication.price && (
                        <p className="text-sm font-medium text-neutral-700 mt-1">
                          {selectedMedication.price}
                        </p>
                      )}
                    </div>
                    <div className={`
                      flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1
                      ${
                        deliveryMethod === 'delivery'
                          ? 'border-healing-sage-500 bg-healing-sage-500'
                          : 'border-neutral-300'
                      }
                    `}>
                      {deliveryMethod === 'delivery' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <PrimaryButton onClick={handleConfirmOrder} fullWidth mode={mode}>
                Confirm Order
              </PrimaryButton>
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-full py-3 text-neutral-600 hover:text-neutral-800 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
