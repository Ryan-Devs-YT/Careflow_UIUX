import { useState } from 'react';
import { ArrowLeft, Send, Pill, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'pharmacist';
  text: string;
  timestamp: Date;
}

interface PharmacistChatProps {
  onBack: () => void;
  currentMedications: Array<{ id: string; name: string; dosage: string }>;
}

// Mock medicine database for quick ordering
const MEDICINE_DATABASE = [
  { id: 'm1', name: 'Aspirin', dosage: '75mg' },
  { id: 'm2', name: 'Paracetamol', dosage: '500mg' },
  { id: 'm3', name: 'Ibuprofen', dosage: '200mg' },
  { id: 'm4', name: 'Omeprazole', dosage: '20mg' },
  { id: 'm5', name: 'Amoxicillin', dosage: '500mg' },
  { id: 'm6', name: 'Metformin', dosage: '500mg' },
  { id: 'm7', name: 'Lisinopril', dosage: '10mg' },
  { id: 'm8', name: 'Atorvastatin', dosage: '20mg' },
];

export function PharmacistChat({ onBack, currentMedications }: PharmacistChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'pharmacist',
      text: 'Hello! I\'m here to help you with refills and new medications. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const [showRefillSelection, setShowRefillSelection] = useState(false);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);

  const sendMessage = (text: string, isUser = true) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: isUser ? 'user' : 'pharmacist',
      text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setShowQuickOptions(false);

    // Simulate pharmacist response
    if (isUser) {
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'pharmacist',
          text: 'I\'ve received your request. Let me prepare that for you. Is there anything else you need?',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  const handleRefillRequest = () => {
    setShowRefillSelection(true);
    setShowQuickOptions(false);
  };

  const confirmRefill = () => {
    if (selectedMeds.length === 0) {
      toast.error('Please select at least one medication');
      return;
    }

    const medNames = selectedMeds
      .map(id => currentMedications.find(m => m.id === id)?.name)
      .join(', ');
    
    sendMessage(`I'd like to refill: ${medNames}`);
    setShowRefillSelection(false);
    setSelectedMeds([]);
    toast.success('Refill request sent!');
  };

  const handleNewMedicineOrder = () => {
    setShowMedicineSearch(true);
    setShowQuickOptions(false);
  };

  const orderMedicine = (medName: string, dosage: string) => {
    sendMessage(`I'd like to order ${medName} ${dosage}`);
    setShowMedicineSearch(false);
    setSearchQuery('');
    toast.success('Order request sent!');
  };

  const filteredDatabase = MEDICINE_DATABASE.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            💊
          </div>
          <div>
            <h1 className="text-2xl font-bold">Pharmacist</h1>
            <p className="text-healing-sage-100 text-sm">Online • Usually replies instantly</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-healing-sage-500 text-white rounded-br-sm'
                  : 'bg-white text-neutral-700 rounded-bl-sm shadow-md'
              }`}
            >
              <p className="text-base">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-healing-sage-100' : 'text-neutral-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Quick Options */}
        <AnimatePresence>
          {showQuickOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap gap-2"
            >
              <button
                onClick={handleRefillRequest}
                className="px-4 py-2 bg-white text-healing-sage-600 rounded-full shadow-md hover:shadow-lg transition-all font-medium border-2 border-healing-sage-200"
              >
                🔄 Refill Current Medications
              </button>
              <button
                onClick={handleNewMedicineOrder}
                className="px-4 py-2 bg-white text-healing-sage-600 rounded-full shadow-md hover:shadow-lg transition-all font-medium border-2 border-healing-sage-200"
              >
                ➕ Order New Medicine
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refill Selection */}
        <AnimatePresence>
          {showRefillSelection && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl shadow-lg p-5"
            >
              <h3 className="font-semibold text-neutral-700 mb-3">Select medications to refill:</h3>
              
              <div className="space-y-2 mb-4">
                {currentMedications.map(med => (
                  <button
                    key={med.id}
                    onClick={() => {
                      setSelectedMeds(prev => 
                        prev.includes(med.id) 
                          ? prev.filter(id => id !== med.id)
                          : [...prev, med.id]
                      );
                    }}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedMeds.includes(med.id)
                        ? 'border-healing-sage-500 bg-healing-sage-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedMeds.includes(med.id)
                          ? 'bg-healing-sage-500 border-healing-sage-500'
                          : 'border-neutral-300'
                      }`}>
                        {selectedMeds.includes(med.id) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-700">{med.name}</p>
                        <p className="text-sm text-neutral-600">{med.dosage}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowRefillSelection(false);
                    setSelectedMeds([]);
                    setShowQuickOptions(true);
                  }}
                  className="flex-1 py-3 bg-neutral-200 text-neutral-700 rounded-xl font-medium hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRefill}
                  className="flex-1 py-3 bg-healing-sage-500 text-white rounded-xl font-medium hover:bg-healing-sage-600 transition-colors"
                >
                  Confirm Refill
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Medicine Search */}
        <AnimatePresence>
          {showMedicineSearch && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl shadow-lg p-5"
            >
              <h3 className="font-semibold text-neutral-700 mb-3">Search for medicine:</h3>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Type medicine name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {filteredDatabase.map(med => (
                  <button
                    key={med.id}
                    onClick={() => orderMedicine(med.name, med.dosage)}
                    className="w-full text-left p-3 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-neutral-700">{med.name}</p>
                    <p className="text-sm text-neutral-600">{med.dosage}</p>
                  </button>
                ))}

                {searchQuery && filteredDatabase.length === 0 && (
                  <p className="text-center text-neutral-500 py-4">No medicines found</p>
                )}
              </div>

              <button
                onClick={() => {
                  setShowMedicineSearch(false);
                  setSearchQuery('');
                  setShowQuickOptions(true);
                }}
                className="w-full py-3 bg-neutral-200 text-neutral-700 rounded-xl font-medium hover:bg-neutral-300 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-neutral-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && inputText.trim()) {
                sendMessage(inputText);
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none"
          />
          <button
            onClick={() => inputText.trim() && sendMessage(inputText)}
            disabled={!inputText.trim()}
            className="w-12 h-12 bg-healing-sage-500 text-white rounded-xl flex items-center justify-center hover:bg-healing-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
