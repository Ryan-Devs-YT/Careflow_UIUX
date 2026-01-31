import { useState } from 'react';
import { ArrowLeft, Search, Plus, AlertTriangle, Replace, Trash2, Tag, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  timing: 'pre' | 'post' | 'at' | null;
  description: string;
  usage: string;
  stock?: number;
  interactions?: string[];
}

interface PrescriptionScreenProps {
  onBack: () => void;
  currentPrescription: Medicine[];
  onReplace: (oldId: string, newMed: Medicine) => void;
  onDiscard: (id: string) => void;
  onTag: (id: string, timing: 'pre' | 'post' | 'at') => void;
  onAddMedicine: (med: Medicine) => void;
  onRefillAlert: () => void;
}

// 50 Medicine Database
const MEDICINE_DATABASE: Medicine[] = [
  { id: 'db1', name: 'Aspirin', dosage: '75mg', description: 'Blood thinner and pain relief', usage: 'Heart health', interactions: ['Ibuprofen', 'Warfarin', 'Naproxen'] },
  { id: 'db2', name: 'Paracetamol', dosage: '500mg', description: 'Pain and fever reducer', usage: 'Pain management', interactions: [] },
  { id: 'db3', name: 'Ibuprofen', dosage: '200mg', description: 'NSAID for pain/inflammation', usage: 'Pain management', interactions: ['Aspirin', 'Warfarin', 'Lisinopril'] },
  { id: 'db4', name: 'Amoxicillin', dosage: '500mg', description: 'Penicillin antibiotic', usage: 'Bacterial infections', interactions: [] },
  { id: 'db5', name: 'Lisinopril', dosage: '10mg', description: 'ACE inhibitor', usage: 'Hypertension', interactions: ['Ibuprofen', 'Potassium', 'Naproxen'] },
  { id: 'db6', name: 'Atorvastatin', dosage: '20mg', description: 'Statin', usage: 'Cholesterol', interactions: ['Grapefruit', 'Clarithromycin'] },
  { id: 'db7', name: 'Metformin', dosage: '500mg', description: 'Antidiabetic', usage: 'Type 2 Diabetes', interactions: ['Alcohol'] },
  { id: 'db8', name: 'Amlodipine', dosage: '5mg', description: 'Calcium channel blocker', usage: 'Hypertension', interactions: ['Simvastatin'] },
  { id: 'db9', name: 'Metoprolol', dosage: '25mg', description: 'Beta blocker', usage: 'Hypertension', interactions: [] },
  { id: 'db10', name: 'Omeprazole', dosage: '20mg', description: 'Proton pump inhibitor', usage: 'Acid reflux', interactions: ['Clopidogrel'] },
  { id: 'db11', name: 'Losartan', dosage: '50mg', description: 'ARB', usage: 'Hypertension', interactions: ['Lithium'] },
  { id: 'db12', name: 'Gabapentin', dosage: '300mg', description: 'Anticonvulsant', usage: 'Nerve pain', interactions: ['Opioids'] },
  { id: 'db13', name: 'Hydrochlorothiazide', dosage: '12.5mg', description: 'Diuretic', usage: 'Hypertension', interactions: ['Lithium'] },
  { id: 'db14', name: 'Sertraline', dosage: '50mg', description: 'SSRI', usage: 'Depression', interactions: ['NSAIDs', 'MAOIs'] },
  { id: 'db15', name: 'Simvastatin', dosage: '20mg', description: 'Statin', usage: 'Cholesterol', interactions: ['Amlodipine', 'Grapefruit'] },
  { id: 'db16', name: 'Montelukast', dosage: '10mg', description: 'Leukotriene receptor antagonist', usage: 'Asthma', interactions: [] },
  { id: 'db17', name: 'Escitalopram', dosage: '10mg', description: 'SSRI', usage: 'Anxiety/Depression', interactions: ['NSAIDs'] },
  { id: 'db18', name: 'Furosemide', dosage: '40mg', description: 'Loop diuretic', usage: 'Edema', interactions: [] },
  { id: 'db19', name: 'Pantoprazole', dosage: '40mg', description: 'Proton pump inhibitor', usage: 'GERD', interactions: [] },
  { id: 'db20', name: 'Trazodone', dosage: '50mg', description: 'Antidepressant', usage: 'Insomnia', interactions: ['CNS Depressants'] },
  { id: 'db21', name: 'Fluticasone', dosage: '50mcg', description: 'Corticosteroid', usage: 'Allergies', interactions: [] },
  { id: 'db22', name: 'Tramadol', dosage: '50mg', description: 'Opioid analgesic', usage: 'Pain', interactions: ['SSRI', 'Benzodiazepines'] },
  { id: 'db23', name: 'Duloxetine', dosage: '30mg', description: 'SNRI', usage: 'Depression/Pain', interactions: ['NSAIDs'] },
  { id: 'db24', name: 'Prednisone', dosage: '10mg', description: 'Corticosteroid', usage: 'Inflammation', interactions: ['NSAIDs', 'Warfarin'] },
  { id: 'db25', name: 'Tamsulosin', dosage: '0.4mg', description: 'Alpha blocker', usage: 'BPH', interactions: [] },
  { id: 'db26', name: 'Potassium Chloride', dosage: '10mEq', description: 'Electrolyte', usage: 'Low Potassium', interactions: ['Lisinopril'] },
  { id: 'db27', name: 'Clopidogrel', dosage: '75mg', description: 'Antiplatelet', usage: 'Heart health', interactions: ['Omeprazole', 'NSAIDs'] },
  { id: 'db28', name: 'Meloxicam', dosage: '15mg', description: 'NSAID', usage: 'Arthritis', interactions: ['Aspirin', 'Warfarin'] },
  { id: 'db29', name: 'Rosuvastatin', dosage: '10mg', description: 'Statin', usage: 'Cholesterol', interactions: ['Antacids'] },
  { id: 'db30', name: 'Warfarin', dosage: '5mg', description: 'Anticoagulant', usage: 'Blood thinner', interactions: ['Aspirin', 'Ibuprofen', 'Vitamin K', 'Antibiotics'] },
  { id: 'db31', name: 'Cyclobenzaprine', dosage: '10mg', description: 'Muscle relaxant', usage: 'Muscle spasms', interactions: ['CNS Depressants'] },
  { id: 'db32', name: 'Albuterol', dosage: '90mcg', description: 'Bronchodilator', usage: 'Asthma', interactions: ['Beta blockers'] },
  { id: 'db33', name: 'Carvedilol', dosage: '12.5mg', description: 'Beta blocker', usage: 'Heart failure', interactions: [] },
  { id: 'db34', name: 'Citalopram', dosage: '20mg', description: 'SSRI', usage: 'Depression', interactions: ['NSAIDs'] },
  { id: 'db35', name: 'Ranitidine', dosage: '150mg', description: 'H2 blocker', usage: 'Acid reflux', interactions: [] },
  { id: 'db36', name: 'Venlafaxine', dosage: '75mg', description: 'SNRI', usage: 'Depression', interactions: [] },
  { id: 'db37', name: 'Oxycodone', dosage: '5mg', description: 'Opioid', usage: 'Severe Pain', interactions: ['Alcohol', 'Benzodiazepines'] },
  { id: 'db38', name: 'Allopurinol', dosage: '100mg', description: 'Xanthine oxidase inhibitor', usage: 'Gout', interactions: ['Warfarin'] },
  { id: 'db39', name: 'Naproxen', dosage: '500mg', description: 'NSAID', usage: 'Pain', interactions: ['Aspirin', 'Lisinopril'] },
  { id: 'db40', name: 'Doxycycline', dosage: '100mg', description: 'Tetracycline antibiotic', usage: 'Infections', interactions: ['Calcium', 'Iron'] },
  { id: 'db41', name: 'Amitriptyline', dosage: '25mg', description: 'Tricyclic antidepressant', usage: 'Pain/Sleep', interactions: [] },
  { id: 'db42', name: 'Methylprednisolone', dosage: '4mg', description: 'Corticosteroid', usage: 'Inflammation', interactions: [] },
  { id: 'db43', name: 'Clonazepam', dosage: '0.5mg', description: 'Benzodiazepine', usage: 'Anxiety', interactions: ['Opioids', 'Alcohol'] },
  { id: 'db44', name: 'Loratadine', dosage: '10mg', description: 'Antihistamine', usage: 'Allergies', interactions: [] },
  { id: 'db45', name: 'Cetirizine', dosage: '10mg', description: 'Antihistamine', usage: 'Allergies', interactions: [] },
  { id: 'db46', name: 'Folic Acid', dosage: '1mg', description: 'Vitamin', usage: 'Supplement', interactions: [] },
  { id: 'db47', name: 'Vitamin D3', dosage: '2000IU', description: 'Vitamin', usage: 'Supplement', interactions: [] },
  { id: 'db48', name: 'Magnesium', dosage: '250mg', description: 'Mineral', usage: 'Supplement', interactions: [] },
  { id: 'db49', name: 'Insulin Glargine', dosage: '100u/ml', description: 'Insulin', usage: 'Diabetes', interactions: [] },
  { id: 'db50', name: 'Levothyroxine', dosage: '50mcg', description: 'Hormone', usage: 'Hypothyroidism', interactions: ['Calcium', 'Iron'] },
  { id: 'db51', name: 'Nitroglycerin', dosage: '0.4mg', description: 'Nitrate', usage: 'Chest Pain', interactions: ['Sildenafil', 'Tadalafil'] },
  { id: 'db52', name: 'Sildenafil', dosage: '50mg', description: 'PDE5 Inhibitor', usage: 'ED', interactions: ['Nitroglycerin', 'Nitrates'] },
].map(m => ({ ...m, timing: null })); // Add timing null as default

export function PrescriptionScreen({
  onBack,
  currentPrescription,
  onReplace,
  onDiscard,
  onTag,
  onAddMedicine,
  onRefillAlert,
}: PrescriptionScreenProps) {
  const [showSafetyMatrix, setShowSafetyMatrix] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceModeId, setReplaceModeId] = useState<string | null>(null);

  const getTimingBadge = (timing: 'pre' | 'post' | 'at' | null) => {
    if (!timing) return null;
    const styles = {
      pre: 'bg-info-light text-info-dark',
      post: 'bg-success-light text-success-dark',
      at: 'bg-warm-comfort-200 text-warm-comfort-600',
    };
    const labels = { pre: 'Before meal', post: 'After meal', at: 'With meal' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[timing]}`}>
        {labels[timing]}
      </span>
    );
  };

  // Check for dangerous interactions
  const checkSafetyMatrix = () => {
    const warnings: string[] = [];
    
    // Create a map of current meds for easier lookup
    const currentMedNames = currentPrescription.map(m => m.name.toLowerCase());
    
    currentPrescription.forEach(med => {
      if (med.interactions) {
        med.interactions.forEach(interaction => {
           // Check if the interaction exists in the current prescription
           const conflict = currentPrescription.find(m => m.name.toLowerCase() === interaction.toLowerCase() || m.name.toLowerCase().includes(interaction.toLowerCase()));
           if (conflict) {
             const warning = `⚠️ ${med.name} + ${conflict.name}: Potential dangerous interaction.`;
             if (!warnings.includes(warning)) {
               warnings.push(warning);
             }
           }
        });
      }
    });

    // Hardcoded check for the mock data demonstration if exact names don't match
    if (currentMedNames.includes('aspirin') && currentMedNames.includes('ibuprofen')) {
        const w = '⚠️ Aspirin + Ibuprofen: May increase bleeding risk';
        if (!warnings.includes(w)) warnings.push(w);
    }

    return warnings;
  };

  const safetyWarnings = checkSafetyMatrix();
  
  const filteredDatabase = MEDICINE_DATABASE.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockMeds = currentPrescription.filter(m => (m.stock || 0) < 3);

  const handleSearchSelect = (med: Medicine) => {
    if (replaceModeId) {
      onReplace(replaceModeId, med);
    } else {
      onAddMedicine(med);
    }
    setSearchOpen(false);
    setSearchQuery('');
    setReplaceModeId(null);
  };

  const openSearch = (replaceId?: string) => {
    setReplaceModeId(replaceId || null);
    setSearchQuery('');
    setSearchOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold">Prescription</h1>
        <p className="text-healing-sage-100">Manage your current medications</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Current Prescription */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-700 mb-4">Current Prescription</h2>
          <div className="space-y-3">
            <AnimatePresence>
            {currentPrescription.map((med) => (
              <motion.div
                key={med.id}
                layout
                className="bg-white rounded-2xl shadow-md p-5 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setSelectedMedicine(selectedMedicine?.id === med.id ? null : med)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-700 text-lg">{med.name}</h3>
                      {getTimingBadge(med.timing)}
                      {(med.stock || 0) < 3 && (
                        <span className="px-2 py-0.5 bg-error-light text-error-dark text-xs rounded-full flex items-center gap-1">
                           <AlertCircle className="w-3 h-3" /> Low Stock
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600">{med.dosage}</p>
                  </button>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openSearch(med.id)}
                      className="p-2 bg-info-light rounded-lg hover:bg-info-main/20 transition-colors"
                      title="Replace"
                    >
                      <Replace className="w-5 h-5 text-info-dark" />
                    </button>
                    
                    <button
                      onClick={() => {
                        onDiscard(med.id);
                        toast.success('Medicine removed from prescription');
                      }}
                      className="p-2 bg-error-light rounded-lg hover:bg-error-main/20 transition-colors"
                      title="Discard"
                    >
                      <Trash2 className="w-5 h-5 text-error-dark" />
                    </button>

                    <div className="relative group">
                      <button
                        className="p-2 bg-warm-comfort-100 rounded-lg hover:bg-warm-comfort-200 transition-colors"
                        title="Tag meal timing"
                      >
                        <Tag className="w-5 h-5 text-warm-comfort-600" />
                      </button>
                      
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl p-2 hidden group-hover:block z-20 min-w-[140px]">
                        <button
                          onClick={() => onTag(med.id, 'pre')}
                          className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded text-sm"
                        >
                          Before meal
                        </button>
                        <button
                          onClick={() => onTag(med.id, 'post')}
                          className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded text-sm"
                        >
                          After meal
                        </button>
                        <button
                          onClick={() => onTag(med.id, 'at')}
                          className="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded text-sm"
                        >
                          With meal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medicine Description Dropdown */}
                <AnimatePresence>
                  {selectedMedicine?.id === med.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-neutral-200"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Info className="w-5 h-5 text-healing-sage-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-700 mb-1">Usage:</p>
                          <p className="text-sm text-neutral-600">{med.usage}</p>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 ml-7">{med.description}</p>
                      {med.interactions && med.interactions.length > 0 && (
                         <div className="mt-2 ml-7">
                            <p className="text-xs font-semibold text-warning-dark">Interactions: {med.interactions.join(', ')}</p>
                         </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            </AnimatePresence>

            {currentPrescription.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <p className="text-neutral-500">No medicines in current prescription</p>
              </div>
            )}
          </div>
        </section>

        {/* Safety Matrix */}
        <section>
          <button
            onClick={() => setShowSafetyMatrix(!showSafetyMatrix)}
            className="w-full bg-white rounded-2xl shadow-md p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                safetyWarnings.length > 0 ? 'bg-error-light' : 'bg-success-light'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  safetyWarnings.length > 0 ? 'text-error-dark' : 'text-success-dark'
                }`} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-neutral-700">Safety Matrix</h3>
                <p className="text-sm text-neutral-600">
                  {safetyWarnings.length > 0 
                    ? `${safetyWarnings.length} warning(s) found` 
                    : 'No interactions detected'}
                </p>
              </div>
            </div>
            <span className="text-2xl">{showSafetyMatrix ? '−' : '+'}</span>
          </button>

          <AnimatePresence>
            {showSafetyMatrix && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-white rounded-2xl shadow-md p-5 overflow-hidden"
              >
                {safetyWarnings.length > 0 ? (
                  <div className="space-y-2">
                    {safetyWarnings.map((warning, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-error-light rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-error-dark flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-error-dark">{warning}</p>
                      </div>
                    ))}
                    <div className="mt-4 p-3 bg-neutral-100 rounded-lg border border-neutral-200">
                        <p className="text-sm font-medium text-neutral-700">Re-consult advised</p>
                        <p className="text-xs text-neutral-500">Since a dangerous mixture was detected, please consult your doctor immediately.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-success-light rounded-lg">
                    <span className="text-2xl">✓</span>
                    <p className="text-sm text-success-dark">
                      All medications are safe to take together
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Add Medicine Button */}
        <button
          onClick={() => openSearch()}
          className="w-full bg-healing-sage-500 text-white rounded-2xl shadow-md p-5 flex items-center justify-center gap-3 hover:bg-healing-sage-600 transition-colors"
        >
          <Plus className="w-6 h-6" />
          <span className="font-semibold text-lg">Add Medicine</span>
        </button>

        {/* Refill Alert Button (Conditional) */}
        {lowStockMeds.length > 0 && (
            <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onRefillAlert}
            className="w-full bg-warning-light text-warning-dark border-2 border-warning-main rounded-2xl shadow-md p-5 flex items-center justify-between hover:bg-warning-light/80 transition-colors"
            >
            <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <div className="text-left">
                    <span className="font-semibold text-lg block">Refill Needed</span>
                    <span className="text-sm">Low stock: {lowStockMeds.map(m => m.name).join(', ')}</span>
                </div>
            </div>
            <span className="text-sm font-medium">Contact Pharmacist →</span>
            </motion.button>
        )}
      </div>

      {/* Search Dialog */}
      {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[80vh] flex flex-col"
              >
                  <div className="p-4 border-b border-neutral-200 flex items-center gap-2">
                    <Search className="w-5 h-5 text-neutral-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder={replaceModeId ? "Search replacement..." : "Search medicine..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 outline-none text-lg"
                    />
                    <button onClick={() => setSearchOpen(false)} className="text-neutral-400 hover:text-neutral-600">Cancel</button>
                  </div>
                  
                  <div className="overflow-y-auto p-2">
                    {filteredDatabase.map((med) => (
                        <button
                            key={med.id}
                            onClick={() => handleSearchSelect(med)}
                            className="w-full text-left p-3 hover:bg-neutral-50 rounded-lg transition-colors border-b border-neutral-100 last:border-0"
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-neutral-700">{med.name}</h4>
                                <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">{med.dosage}</span>
                            </div>
                            <p className="text-sm text-neutral-500 mt-1">{med.usage}</p>
                            {med.interactions && med.interactions.length > 0 && (
                                <p className="text-xs text-warning-dark mt-1">Interacts with: {med.interactions.join(', ')}</p>
                            )}
                        </button>
                    ))}
                    {filteredDatabase.length === 0 && (
                        <div className="p-8 text-center text-neutral-500">
                            No medicines found. Try "Aspirin" or "Metformin".
                        </div>
                    )}
                  </div>
              </motion.div>
          </div>
      )}
    </div>
  );
}