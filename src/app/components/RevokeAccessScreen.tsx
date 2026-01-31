import { useState } from 'react';
import { ArrowLeft, Trash2, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface CareGiver {
  id: string;
  name: string;
  relationship: string;
  email: string;
  avatar?: string;
  status: 'active' | 'pending';
}

interface RevokeAccessScreenProps {
  onBack: () => void;
  caregivers: CareGiver[];
  onRevoke: (id: string) => void;
}

export function RevokeAccessScreen({ onBack, caregivers, onRevoke }: RevokeAccessScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleRevoke = () => {
    if (selectedId) {
      onRevoke(selectedId);
      setSelectedId(null);
      toast.success('Access revoked successfully');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="bg-error-main text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold">Revoke Access</h1>
        <p className="text-error-light">Manage permissions</p>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-neutral-600 mb-4">
          Select a caregiver to remove their access to your health data. They will no longer be able to view your medication or receive alerts.
        </p>

        <div className="space-y-3">
          {caregivers.map((caregiver) => (
            <div
              key={caregiver.id}
              className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between border border-neutral-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-xl">
                  {caregiver.avatar || '👤'}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-700">{caregiver.name}</h3>
                  <p className="text-sm text-neutral-500">{caregiver.relationship}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedId(caregiver.id)}
                className="p-2 bg-error-light text-error-dark rounded-lg hover:bg-error-main hover:text-white transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {caregivers.length === 0 && (
            <div className="text-center py-8 text-neutral-500">
              No active caregivers to revoke.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-error-light rounded-full flex items-center justify-center mb-4">
                  <UserX className="w-8 h-8 text-error-main" />
                </div>
                <h3 className="text-xl font-bold text-neutral-800">Revoke Access?</h3>
                <p className="text-neutral-600 mt-2">
                  Are you sure? This person will be removed from your Care Circle immediately.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedId(null)}
                  className="flex-1 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-medium hover:bg-neutral-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  className="flex-1 py-3 bg-error-main text-white rounded-xl font-medium hover:bg-error-dark"
                >
                  Yes, Revoke
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
