import { useState } from 'react';
import { ArrowLeft, Search, Plus, AlertTriangle, Replace, Trash2, Tag, Info, AlertCircle, Package, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Medicine, MEDICINE_DATABASE, getRefillAlerts, generateVoiceDescription } from '@/app/data/medicines';
import { SafetyMatrix } from './SafetyMatrix';



interface PrescriptionScreenProps {
  onBack: () => void;
  currentPrescription: Medicine[];
  onReplace: (oldId: string, newMed: Medicine) => void;
  onDiscard: (id: string) => void;
  onTag: (id: string, timing: 'pre' | 'post' | 'at') => void;
  onAddMedicine: (med: Medicine) => void;
  onRefillAlert: () => void;
}



export function PrescriptionScreen({ onBack, currentPrescription, onReplace, onDiscard, onTag, onAddMedicine, onRefillAlert }: PrescriptionScreenProps) {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceModeId, setReplaceModeId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState('30');
  const [showSafetyMatrix, setShowSafetyMatrix] = useState(false);
  const [refillAlerts] = useState(() => getRefillAlerts(currentPrescription));

  const cycleTag = (medId: string, current: 'pre' | 'post' | 'at' | null) => {
    const sequence: ('pre' | 'post' | 'at')[] = ['pre', 'at', 'post'];
    const currentIndex = sequence.indexOf(current as any);
    const next = sequence[(currentIndex + 1) % sequence.length];
    onTag(medId, next);
    toast.info(`Updated timing to ${getTimingLabel(next)}`);
  };

  const getTimingLabel = (t: string | null) => {
    if (t === 'pre') return 'Before meal';
    if (t === 'post') return 'After meal';
    return 'With meal';
  };

  const filteredDatabase = MEDICINE_DATABASE.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium">Back</span>
        </button>
        <h1 className="text-3xl font-bold font-secondary text-center">Prescription</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Refill Alerts */}
        {refillAlerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-warning-light border-2 border-warning-main rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-warning-main animate-pulse" />
              <div className="flex-1">
                <h4 className="font-bold text-warning-main">Refill Alert!</h4>
                <p className="text-sm text-neutral-700">
                  {refillAlerts.length} medication{refillAlerts.length > 1 ? 's' : ''} running low. 
                  <button 
                    onClick={onRefillAlert}
                    className="ml-2 underline font-semibold text-warning-main hover:text-warning-dark"
                  >
                    Order Refill →
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Safety Matrix Toggle */}
        {currentPrescription.length > 1 && (
          <button
            onClick={() => setShowSafetyMatrix(!showSafetyMatrix)}
            className="w-full bg-info-light rounded-2xl p-4 flex items-center justify-between hover:bg-info-main/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-info-dark" />
              <span className="font-bold text-info-dark">Safety Matrix & Interaction Check</span>
            </div>
            <ChevronRight className={`w-5 h-5 text-info-dark transition-transform ${showSafetyMatrix ? 'rotate-90' : ''}`} />
          </button>
        )}

        {/* Safety Matrix Component */}
        <AnimatePresence>
          {showSafetyMatrix && currentPrescription.length > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <SafetyMatrix medications={currentPrescription} />
            </motion.div>
          )}
        </AnimatePresence>

        <section>
          <h2 className="text-2xl font-bold text-neutral-700 mb-4">Your List</h2>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {currentPrescription.map((med) => (
                <motion.div key={med.id} layout className="bg-white rounded-2xl shadow-md p-5 border border-neutral-100 overflow-hidden">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-neutral-800 text-xl">{med.name}</h3>
                        <button onClick={() => cycleTag(med.id, med.timing)} className="px-3 py-1 bg-healing-sage-100 text-healing-sage-700 rounded-full text-xs font-bold hover:bg-healing-sage-200 transition-colors">
                          {getTimingLabel(med.timing)}
                        </button>
                      </div>
                      <p className="text-neutral-600 font-medium">{med.dosage}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                        <Package className="w-4 h-4" />
                        <span>Stock: <span className={Number(med.stock) <= 2 ? 'text-error-main font-bold' : ''}>{med.stock} tablets left</span></span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button onClick={() => { setReplaceModeId(med.id); setSearchOpen(true); }} className="p-2 bg-info-light rounded-xl text-info-dark hover:scale-105 transition-transform"><Replace className="w-5 h-5" /></button>
                      <button onClick={() => onDiscard(med.id)} className="p-2 bg-error-light rounded-xl text-error-dark hover:scale-105 transition-transform"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                  
                   <div className="mt-4 pt-4 border-t border-neutral-50 space-y-2">
                     <p className="text-sm text-neutral-600 leading-relaxed italic">
                       <span className="font-bold not-italic">Usage:</span> {med.description}
                     </p>
                     <p className="text-xs text-neutral-500">
                       <span className="font-bold">Voice:</span> {generateVoiceDescription(med)}
                     </p>
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <button onClick={() => { setReplaceModeId(null); setSearchOpen(true); }} className="w-full bg-healing-sage-500 text-white rounded-2xl shadow-lg p-5 flex items-center justify-center gap-3 hover:bg-healing-sage-600 transition-all font-bold text-xl active:scale-95">
          <Plus className="w-7 h-7" />
          Add Medicine
        </button>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{replaceModeId ? 'Replace With' : 'Add New Medicine'}</h3>
                <button onClick={() => setSearchOpen(false)} className="text-neutral-400">Cancel</button>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input autoFocus type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none text-lg" />
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-500 ml-1">Current Stock (Tablets)</label>
                <input type="number" value={tempStock} onChange={(e) => setTempStock(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 rounded-xl mt-1 outline-none font-bold text-healing-sage-600" />
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[40vh] p-2">
              {filteredDatabase.map((med) => (
                <button key={med.id} onClick={() => {
                  const finalMed = { ...med, stock: Number(tempStock) };
                  if (replaceModeId) onReplace(replaceModeId, finalMed);
                  else onAddMedicine(finalMed);
                  setSearchOpen(false);
                }} className="w-full text-left p-4 hover:bg-neutral-50 rounded-2xl transition-colors border-b last:border-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-neutral-800 text-lg">{med.name}</h4>
                    <span className="text-xs bg-neutral-100 px-3 py-1 rounded-full font-bold">{med.dosage}</span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">{med.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
